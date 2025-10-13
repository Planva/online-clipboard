import { generateUUID, getExpiresAt, isExpired } from '../utils/validation.js';

export async function createShare(env, shareData) {
  const id = generateUUID();
  const expiresAt = getExpiresAt(24);

  const stmt = env.DB.prepare(`
    INSERT INTO onlinclipboard_com_clipboard_shares
    (id, passcode, slug, content_type, content_text, file_url, file_name, file_size, mime_type, expires_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    id,
    shareData.passcode,
    shareData.slug,
    shareData.content_type,
    shareData.content_text || null,
    shareData.file_url || null,
    shareData.file_name || null,
    shareData.file_size || null,
    shareData.mime_type || null,
    expiresAt
  );

  await stmt.run();

  return {
    id,
    passcode: shareData.passcode,
    slug: shareData.slug,
    expires_at: expiresAt,
    created_at: new Date().toISOString()
  };
}

export async function getShareByPasscode(env, passcode) {
  const stmt = env.DB.prepare(`
    SELECT * FROM onlinclipboard_com_clipboard_shares
    WHERE passcode = ? AND accessed = 0
    LIMIT 1
  `).bind(passcode);

  const result = await stmt.first();

  if (!result) {
    return null;
  }

  if (isExpired(result.expires_at)) {
    await deleteShare(env, result.id, result.file_url);
    return null;
  }

  return result;
}

export async function getShareBySlug(env, slug) {
  const stmt = env.DB.prepare(`
    SELECT * FROM onlinclipboard_com_clipboard_shares
    WHERE slug = ? AND accessed = 0
    LIMIT 1
  `).bind(slug);

  const result = await stmt.first();

  if (!result) {
    return null;
  }

  if (isExpired(result.expires_at)) {
    await deleteShare(env, result.id, result.file_url);
    return null;
  }

  return result;
}

export async function deleteShare(env, shareId, fileUrl) {
  await env.DB.prepare(`
    DELETE FROM onlinclipboard_com_clipboard_shares WHERE id = ?
  `).bind(shareId).run();

  if (fileUrl) {
    try {
      const key = extractFileKeyFromUrl(fileUrl);
      if (key) {
        await env.R2_BUCKET.delete(key);
      }
    } catch (error) {
      console.error('Error deleting file from R2:', error);
    }
  }
}

export async function createReview(env, reviewData) {
  const id = generateUUID();

  const stmt = env.DB.prepare(`
    INSERT INTO onlinclipboard_com_user_reviews
    (id, rating, comment, ip_hash)
    VALUES (?, ?, ?, ?)
  `).bind(
    id,
    reviewData.rating,
    reviewData.comment || null,
    reviewData.ip_hash
  );

  await stmt.run();

  return {
    id,
    rating: reviewData.rating,
    comment: reviewData.comment,
    created_at: new Date().toISOString()
  };
}

export async function getReviews(env, options = {}) {
  const { limit = 20, offset = 0, rating = null } = options;

  let query = 'SELECT id, rating, comment, created_at FROM onlinclipboard_com_user_reviews';
  const params = [];

  if (rating) {
    query += ' WHERE rating = ?';
    params.push(rating);
  }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const stmt = env.DB.prepare(query).bind(...params);
  const result = await stmt.all();

  return result.results || [];
}

export async function getReviewStats(env) {
  const cacheKey = 'review_stats';

  const cached = await env.CACHE.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const stmt = env.DB.prepare(`
    SELECT
      COUNT(*) as total,
      AVG(rating) as average,
      SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five_star,
      SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four_star,
      SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three_star,
      SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two_star,
      SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one_star
    FROM onlinclipboard_com_user_reviews
  `);

  const result = await stmt.first();

  const stats = {
    total: result.total || 0,
    average: result.average ? parseFloat(result.average.toFixed(2)) : 0,
    distribution: {
      5: result.five_star || 0,
      4: result.four_star || 0,
      3: result.three_star || 0,
      2: result.two_star || 0,
      1: result.one_star || 0,
    }
  };

  await env.CACHE.put(cacheKey, JSON.stringify(stats), { expirationTtl: 300 });

  return stats;
}

export async function cleanupExpiredShares(env) {
  const now = new Date().toISOString();

  const expiredShares = await env.DB.prepare(`
    SELECT id, file_url FROM onlinclipboard_com_clipboard_shares
    WHERE expires_at < ?
  `).bind(now).all();

  if (!expiredShares.results || expiredShares.results.length === 0) {
    return 0;
  }

  for (const share of expiredShares.results) {
    await deleteShare(env, share.id, share.file_url);
  }

  return expiredShares.results.length;
}

function extractFileKeyFromUrl(url) {
  if (!url) return null;
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    return pathParts[pathParts.length - 1];
  } catch {
    return null;
  }
}
