export function generatePasscode(length = 6) {
  const min = length === 4 ? 1000 : 100000;
  const max = length === 4 ? 9999 : 999999;
  return Math.floor(Math.random() * (max - min + 1) + min).toString();
}

export function generateSlug() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let slug = '';
  for (let i = 0; i < 8; i++) {
    slug += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return slug;
}
