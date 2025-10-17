// src/components/QRCodeDisplay.tsx
import { useEffect, useState } from 'react';
import { Download, QrCode } from 'lucide-react';
import { generateQRCodeDataURL } from '../utils/qrcode';

interface QRCodeDisplayProps {
  url: string;
  label?: string;
}

export function QRCodeDisplay({ url, label = 'Scan QR Code' }: QRCodeDisplayProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setFailed(false);
        const result = await generateQRCodeDataURL(url, 512);
        if (!cancelled) setDataUrl(result);
      } catch (e) {
        console.error('Generate QR error:', e);
        if (!cancelled) {
          setFailed(true);
          setDataUrl(null);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [url]);

  const handleDownload = () => {
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'share-qr.png';
    a.click();
  };

  return (
    <div className="flex flex-col items-center">
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{label}</p>

      <div className="p-3 bg-white rounded-xl shadow-sm">
        {dataUrl && !failed ? (
          <img
            src={dataUrl}
            alt="QR code"
            className="w-48 h-48 sm:w-64 sm:h-64"
            // 保证等比显示，避免被 CSS 拉伸导致识别率下降
            style={{ imageRendering: 'pixelated' }}
          />
        ) : (
          <div className="w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center bg-gray-50 rounded-xl">
            <QrCode className="w-16 h-16 text-gray-400" aria-hidden="true" />
          </div>
        )}
      </div>

      <button
        onClick={handleDownload}
        disabled={!dataUrl || failed}
        className="mt-3 flex items-center gap-2 text-sm text-blue-600 disabled:text-gray-400 hover:underline"
        aria-label="Download QR code"
      >
        <Download className="w-4 h-4" aria-hidden="true" />
        <span>下载二维码</span>
      </button>
    </div>
  );
}
