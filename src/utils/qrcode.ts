// src/utils/qrcode.ts
import QRCode, { QRCodeToDataURLOptions } from 'qrcode';

// 确保传入的是绝对 URL（防止没有协议导致某些扫码器无法打开）
function ensureAbsoluteUrl(input: string): string {
  const value = input.trim();
  if (/^https?:\/\//i.test(value)) return value;
  if (typeof window !== 'undefined') {
    const needsSlash = value && !value.startsWith('/');
    return `${window.location.origin}${needsSlash ? '/' : ''}${value}`;
  }
  return value;
}

/**
 * 生成二维码的 DataURL（base64 PNG）
 * @param text 要编码的文本/URL
 * @param size 画布宽度（px）
 */
export async function generateQRCodeDataURL(
  text: string,
  size: number = 512
): Promise<string> {
  const value = ensureAbsoluteUrl(text);

  const options: QRCodeToDataURLOptions = {
    width: size,
    margin: 2,
    errorCorrectionLevel: 'M',
    color: {
      dark: '#000000',
      light: '#FFFFFF',
    },
  };

  // 直接生成 DataURL，供 <img src="..."> 使用
  return QRCode.toDataURL(value, options);
}
