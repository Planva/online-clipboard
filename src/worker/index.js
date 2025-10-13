import { handleSharesAPI } from './api/shares.js';
import { handleReviewsAPI } from './api/reviews.js';
import { handleFilesAPI } from './api/files.js';
import { cleanupExpiredShares } from './db/queries.js';
import { handleCORS } from './utils/cors.js';

export default {
  async fetch(request, env, ctx) {
    const corsResponse = handleCORS(request);
    if (corsResponse) return corsResponse;

    const url = new URL(request.url);

    try {
      if (url.pathname.startsWith('/api/shares')) {
        return await handleSharesAPI(request, env);
      }

      if (url.pathname.startsWith('/api/reviews')) {
        return await handleReviewsAPI(request, env);
      }

      if (url.pathname.startsWith('/api/files/')) {
        return await handleFilesAPI(request, env);
      }

      const response = await env.ASSETS.fetch(request);

      if (response.status === 404 && !url.pathname.startsWith('/api/') && !url.pathname.includes('.')) {
        const indexRequest = new Request(new URL('/', request.url), request);
        return env.ASSETS.fetch(indexRequest);
      }

      return response;
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },

  async scheduled(event, env, ctx) {
    try {
      const deletedCount = await cleanupExpiredShares(env);
      console.log(`Cleaned up ${deletedCount} expired shares`);
    } catch (error) {
      console.error('Error in scheduled cleanup:', error);
    }
  },
};
