import { generateUUID } from '../utils/validation.js';

export async function uploadFileToR2(env, file, fileName) {
  const fileExt = fileName.split('.').pop() || 'bin';
  const key = `${generateUUID()}.${fileExt}`;

  await env.R2_BUCKET.put(key, file, {
    httpMetadata: {
      contentType: file.type || 'application/octet-stream',
    },
  });

  return key;
}

export async function getFileFromR2(env, key) {
  const object = await env.R2_BUCKET.get(key);

  if (!object) {
    return null;
  }

  return {
    body: object.body,
    contentType: object.httpMetadata?.contentType || 'application/octet-stream',
    size: object.size,
  };
}

export async function deleteFileFromR2(env, key) {
  await env.R2_BUCKET.delete(key);
}

export function buildFileUrl(key, domain = 'onlinclipboard.com') {
  return `https://${domain}/api/files/${key}`;
}

export function extractKeyFromUrl(url) {
  if (!url) return null;
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    return pathParts[pathParts.length - 1];
  } catch {
    return null;
  }
}
