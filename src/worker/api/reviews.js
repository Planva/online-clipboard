import { createReview, getReviews, getReviewStats } from '../db/queries.js';
import { validateRating, hashIP } from '../utils/validation.js';
import { corsHeaders } from '../utils/cors.js';

export async function handleReviewsAPI(request, env) {
  const url = new URL(request.url);

  if (request.method === 'POST' && url.pathname === '/api/reviews') {
    return await createReviewHandler(request, env);
  }

  if (request.method === 'GET' && url.pathname === '/api/reviews') {
    return await getReviewsHandler(request, env);
  }

  if (request.method === 'GET' && url.pathname === '/api/reviews/stats') {
    return await getReviewStatsHandler(env);
  }

  return jsonResponse({ error: 'Not found' }, 404);
}

async function createReviewHandler(request, env) {
  try {
    const body = await request.json();
    const { rating, comment } = body;

    const ratingValidation = validateRating(rating);
    if (!ratingValidation.valid) {
      return jsonResponse({ error: ratingValidation.error }, 400);
    }

    const clientIP = request.headers.get('CF-Connecting-IP') ||
                     request.headers.get('X-Real-IP') ||
                     'unknown';
    const ipHash = await hashIP(clientIP);

    const reviewData = {
      rating: ratingValidation.rating,
      comment: comment?.trim() || null,
      ip_hash: ipHash,
    };

    const result = await createReview(env, reviewData);

    return jsonResponse({
      success: true,
      review: {
        id: result.id,
        rating: result.rating,
        comment: result.comment,
        created_at: result.created_at,
      },
    }, 201);
  } catch (error) {
    console.error('Error creating review:', error);
    return jsonResponse({ error: 'Failed to submit review.' }, 500);
  }
}

async function getReviewsHandler(request, env) {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const rating = url.searchParams.get('rating');

    const options = {
      limit: Math.min(limit, 100),
      offset: Math.max(offset, 0),
      rating: rating ? parseInt(rating) : null,
    };

    const reviews = await getReviews(env, options);

    return jsonResponse({
      success: true,
      reviews,
      pagination: {
        limit: options.limit,
        offset: options.offset,
      },
    });
  } catch (error) {
    console.error('Error getting reviews:', error);
    return jsonResponse({ error: 'Failed to fetch reviews.' }, 500);
  }
}

async function getReviewStatsHandler(env) {
  try {
    const stats = await getReviewStats(env);

    return jsonResponse({
      success: true,
      stats,
    });
  } catch (error) {
    console.error('Error getting review stats:', error);
    return jsonResponse({ error: 'Failed to fetch review statistics.' }, 500);
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
