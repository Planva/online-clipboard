import { useState } from 'react';
import { Download, QrCode } from 'lucide-react';

interface QRCodeDisplayProps {
  url: string;
  label?: string;
}

export function QRCodeDisplay({ url, label = "Scan QR Code" }: QRCodeDisplayProps) {
  const [imageError, setImageError] = useState(false);

  // Using Google Charts API for QR code generation (no installation needed)
  const qrCodeUrl = `https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=${encodeURIComponent(url)}`;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = 'qrcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (imageError) {
    return (
      <div className="text-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <QrCode className="w-12 h-12 mx-auto text-gray-400 mb-2" />
        <p className="text-sm text-gray-600 dark:text-gray-400">Unable to load QR code</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{label}</p>
      <div className="bg-white p-4 rounded-xl shadow-md border-2 border-gray-200 dark:border-gray-600">
        <img
          src={qrCodeUrl}
          alt="QR Code to access shared content"
          className="w-48 h-48 sm:w-64 sm:h-64"
          onError={() => setImageError(true)}
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
