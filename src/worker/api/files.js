import { getFileFromR2, buildFileUrl } from '../storage/r2.js';
import { getShareByFileUrl, deleteShare } from '../db/queries.js';
import { corsHeaders } from '../utils/cors.js';

export async function handleFilesAPI(request, env) {
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');
  const key = pathParts[pathParts.length - 1];

  if (!key) {
    return new Response('File not found', { status: 404 });
  }

  try {
    const file = await getFileFromR2(env, key);

    if (!file) {
      return new Response('File not found', { status: 404 });
    }

    const fileUrl = buildFileUrl(key);
    const share = await getShareByFileUrl(env, fileUrl);

    if (share) {
      await deleteShare(env, share.id, share.file_url);
    }

    return new Response(file.body, {
      headers: {
        ...corsHeaders,
        'Content-Type': file.contentType,
        'Cache-Control': 'no-cache',
        'Content-Disposition': 'attachment',
      },
    });
  } catch (error) {
    console.error('Error getting file:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
