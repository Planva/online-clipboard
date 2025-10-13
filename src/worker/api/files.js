import { getFileFromR2 } from '../storage/r2.js';
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

    return new Response(file.body, {
      headers: {
        ...corsHeaders,
        'Content-Type': file.contentType,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error getting file:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
