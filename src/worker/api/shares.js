import { createShare, getShareByPasscode, getShareBySlug, deleteShare } from '../db/queries.js';
import { uploadFileToR2, buildFileUrl } from '../storage/r2.js';
import { validateContentType, validateFileSize, validatePasscode } from '../utils/validation.js';
import { generatePasscode, generateSlug } from '../utils/generators.js';
import { corsHeaders } from '../utils/cors.js';

export async function handleSharesAPI(request, env) {
  const url = new URL(request.url);

  if (request.method === 'POST' && url.pathname === '/api/shares') {
    return await createShareHandler(request, env);
  }

  if (request.method === 'GET' && url.pathname.startsWith('/api/shares/by-passcode/')) {
    const passcode = url.pathname.split('/').pop();
    return await getShareByPasscodeHandler(passcode, env);
  }

  if (request.method === 'GET' && url.pathname.startsWith('/api/shares/by-slug/')) {
    const slug = url.pathname.split('/').pop();
    return await getShareBySlugHandler(slug, env);
  }

  return jsonResponse({ error: 'Not found' }, 404);
}

async function createShareHandler(request, env) {
  try {
    const contentType = request.headers.get('content-type') || '';

    let shareData;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      shareData = await processFormData(formData, env);
    } else if (contentType.includes('application/json')) {
      shareData = await request.json();
    } else {
      return jsonResponse({ error: '不支持的Content-Type' }, 400);
    }

    const typeValidation = validateContentType(shareData.content_type);
    if (!typeValidation.valid) {
      return jsonResponse({ error: typeValidation.error }, 400);
    }

    if (shareData.content_type === 'text' && !shareData.content_text) {
      return jsonResponse({ error: '文本内容不能为空' }, 400);
    }

    if ((shareData.content_type === 'image' || shareData.content_type === 'file') && !shareData.file_url) {
      return jsonResponse({ error: '文件不能为空' }, 400);
    }

    const passcode = generatePasscode(shareData.passcode_length || 6);
    const slug = generateSlug();

    shareData.passcode = passcode;
    shareData.slug = slug;

    const result = await createShare(env, shareData);

    return jsonResponse({
      success: true,
      passcode: result.passcode,
      slug: result.slug,
      expires_at: result.expires_at,
    }, 201);
  } catch (error) {
    console.error('Error creating share:', error);
    return jsonResponse({ error: '创建分享失败' }, 500);
  }
}

async function processFormData(formData, env) {
  const contentType = formData.get('content_type');
  const contentText = formData.get('content_text');
  const file = formData.get('file');
  const passcodeLength = parseInt(formData.get('passcode_length') || '6');

  const shareData = {
    content_type: contentType,
    content_text: contentText,
    passcode_length: passcodeLength,
  };

  if (file && file.size > 0) {
    const sizeValidation = validateFileSize(file.size);
    if (!sizeValidation.valid) {
      throw new Error(sizeValidation.error);
    }

    const key = await uploadFileToR2(env, file, file.name);
    shareData.file_url = buildFileUrl(key);
    shareData.file_name = file.name;
    shareData.file_size = file.size;
    shareData.mime_type = file.type;
  }

  return shareData;
}

async function getShareByPasscodeHandler(passcode, env) {
  try {
    const validation = validatePasscode(passcode);
    if (!validation.valid) {
      return jsonResponse({ error: validation.error }, 400);
    }

    const share = await getShareByPasscode(env, validation.passcode);

    if (!share) {
      return jsonResponse({ error: '口令无效、已被使用或已过期' }, 404);
    }

    await deleteShare(env, share.id, share.file_url);

    return jsonResponse({
      success: true,
      content_type: share.content_type,
      content_text: share.content_text,
      file_url: share.file_url,
      file_name: share.file_name,
      file_size: share.file_size,
      mime_type: share.mime_type,
    });
  } catch (error) {
    console.error('Error retrieving share by passcode:', error);
    return jsonResponse({ error: '获取分享失败' }, 500);
  }
}

async function getShareBySlugHandler(slug, env) {
  try {
    if (!slug || slug.length !== 8) {
      return jsonResponse({ error: '无效的分享链接' }, 400);
    }

    const share = await getShareBySlug(env, slug);

    if (!share) {
      return jsonResponse({ error: '链接无效、已被使用或已过期' }, 404);
    }

    await deleteShare(env, share.id, share.file_url);

    return jsonResponse({
      success: true,
      content_type: share.content_type,
      content_text: share.content_text,
      file_url: share.file_url,
      file_name: share.file_name,
      file_size: share.file_size,
      mime_type: share.mime_type,
    });
  } catch (error) {
    console.error('Error retrieving share by slug:', error);
    return jsonResponse({ error: '获取分享失败' }, 500);
  }
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
}
