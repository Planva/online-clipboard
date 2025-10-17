import { useState, useEffect } from 'react';
import { Download, QrCode } from 'lucide-react';
import { generateQRCodeDataURL } from '../utils/qrcode';

interface QRCodeDisplayProps {
  url: string;
  label?: string;
}

export function QRCodeDisplay({ url, label = "Scan QR Code" }: QRCodeDisplayProps) {
  const [qrDataURL, setQrDataURL] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    try {
      // Generate QR code using client-side generator
      const dataURL = generateQRCodeDataURL(url, 300);
      setQrDataURL(dataURL);
      setError(false);
    } catch (err) {
      console.error('Failed to generate QR code:', err);
      setError(true);
    }
  }, [url]);

  const handleDownload = () => {
    if (!qrDataURL) return;

    const link = document.createElement('a');
    link.href = qrDataURL;
    link.download = 'onlinclipboard-qrcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (error) {
    return (
      <div className="text-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <QrCode className="w-12 h-12 mx-auto text-gray-400 mb-2" aria-hidden="true" />
        <p className="text-sm text-gray-600 dark:text-gray-400">Unable to generate QR code</p>
      </div>
    );
  }

  if (!qrDataURL) {
    return (
      <div className="text-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Generating QR code...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{label}</p>
      <div className="bg-white p-4 rounded-xl shadow-md border-2 border-gray-200 dark:border-gray-600">
        <img
          src={qrDataURL}
          alt="QR Code to access shared content"
          className="w-48 h-48 sm:w-64 sm:h-64"
        />
      </div>
      <button
        onClick={handleDownload}
        className="mt-4 flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        aria-label="Download QR code"
      >
        <Download className="w-4 h-4" aria-hidden="true" />
        <span>Download QR Code</span>
      </button>
    </div>
  );
}
