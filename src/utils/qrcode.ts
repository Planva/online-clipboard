import QRCode from 'qrcode';

interface QRCodeOptions {
  width?: number;
  margin?: number;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  color?: {
    dark?: string;
    light?: string;
  };
}

// Generate QR code as data URL
export async function generateQRCodeDataURL(
  text: string,
  size: number = 300
): Promise<string> {
  const options: QRCodeOptions = {
    width: size,
    margin: 2,
    errorCorrectionLevel: 'M',
    color: {
      dark: '#000000',
      light: '#FFFFFF',
    },
  };

  try {
    return await QRCode.toDataURL(text, options);
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
}

// Generate QR code canvas element
export async function generateQRCodeCanvas(
  text: string,
  size: number = 300
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');

  const options: QRCodeOptions = {
    width: size,
    margin: 2,
    errorCorrectionLevel: 'M',
    color: {
      dark: '#000000',
      light: '#FFFFFF',
    },
  };

  try {
    await QRCode.toCanvas(canvas, text, options);
    return canvas;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
}
