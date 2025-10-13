export function validatePasscode(passcode) {
  if (!passcode || typeof passcode !== 'string') {
    return { valid: false, error: '口令不能为空' };
  }

  const cleaned = passcode.replace(/\D/g, '');

  if (cleaned.length !== 4 && cleaned.length !== 6) {
    return { valid: false, error: '口令必须是4位或6位数字' };
  }

  return { valid: true, passcode: cleaned };
}

export function validateContentType(contentType) {
  const validTypes = ['text', 'image', 'file'];
  if (!validTypes.includes(contentType)) {
    return { valid: false, error: '无效的内容类型' };
  }
  return { valid: true };
}

export function validateRating(rating) {
  const numRating = parseInt(rating);
  if (isNaN(numRating) || numRating < 1 || numRating > 5) {
    return { valid: false, error: '评分必须在1-5之间' };
  }
  return { valid: true, rating: numRating };
}

export function validateFileSize(size, maxSize = 300 * 1024 * 1024) {
  const numSize = parseInt(size);
  if (isNaN(numSize) || numSize <= 0) {
    return { valid: false, error: '无效的文件大小' };
  }
  if (numSize > maxSize) {
    return {
      valid: false,
      error: `文件大小 ${(numSize / 1024 / 1024).toFixed(2)}MB 超过 ${(maxSize / 1024 / 1024).toFixed(0)}MB 限制`
    };
  }
  return { valid: true, size: numSize };
}

export async function hashIP(ip, salt = 'onlinclipboard-salt-2024') {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function generateUUID() {
  return crypto.randomUUID();
}

export function getExpiresAt(hoursFromNow = 24) {
  const date = new Date();
  date.setHours(date.getHours() + hoursFromNow);
  return date.toISOString();
}

export function isExpired(expiresAt) {
  return new Date(expiresAt) < new Date();
}
