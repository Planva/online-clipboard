import { useState, useEffect } from 'react';
import { Download, FileText, Image as ImageIcon, File, Copy } from 'lucide-react';
import { api, ClipboardShare } from '../lib/api';

export function ShareRetrieve() {
  const [passcode, setPasscode] = useState('');
  const [loading, setLoading] = useState(false);
  const [share, setShare] = useState<ClipboardShare | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('s');
    if (slug) {
      handleRetrieveBySlug(slug);
    }
  }, []);

  const handleRetrieveBySlug = async (slug: string) => {
    setLoading(true);
    setError('');

    try {
      const data = await api.shares.getBySlug(slug);
      setShare(data);
      window.history.replaceState({}, '', window.location.pathname);
    } catch (err) {
      console.error('Error retrieving share:', err);
      setError(err instanceof Error ? err.message : 'Failed to retrieve. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRetrieve = async () => {
    if (!passcode.trim()) {
      setError('Please enter the passcode.');
      return;
    }

    const cleanPasscode = passcode.replace(/\D/g, '');
    if (cleanPasscode.length !== 4 && cleanPasscode.length !== 6) {
      setError('The passcode must be a 4- or 6-digit number.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await api.shares.getByPasscode(cleanPasscode);
      setShare(data);
    } catch (err) {
      console.error('Error retrieving share:', err);
      setError(err instanceof Error ? err.message : 'Failed to retrieve. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = () => {
    if (share?.content_text) {
      navigator.clipboard.writeText(share.content_text);
      alert('Text copied to clipboard.');
    }
  };

  const handleDownload = () => {
    if (share?.file_url) {
      const downloadUrl = `${share.file_url}?delete=true`;
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = share.file_name || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleReset = () => {
    setShare(null);
    setPasscode('');
    setError('');
  };

  if (share) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {share.content_type === 'text' && <FileText className="w-8 h-8 text-green-600" />}
            {share.content_type === 'image' && <ImageIcon className="w-8 h-8 text-green-600" />}
            {share.content_type === 'file' && <File className="w-8 h-8 text-green-600" />}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">Retrieved Successfully</h2>
          <p className="text-sm text-gray-600">This content has been destroyed and can’t be accessed again.</p>
        </div>

        {share.content_type === 'text' && share.content_text && (
          <div className="mb-6">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-4">
              <pre className="whitespace-pre-wrap break-words text-sm text-gray-900 dark:text-white font-mono">
                {share.content_text}
              </pre>
            </div>
            <button
              onClick={handleCopyText}
              className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Copy className="w-5 h-5" />
              <span>Copy text</span>
            </button>
          </div>
        )}

        {share.content_type === 'image' && share.file_url && (
          <div className="mb-6">
            <img
              src={share.file_url}
              alt="Shared image"
              className="w-full rounded-xl mb-4"
            />
            <button
              onClick={handleDownload}
              className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              <span>Download image</span>
            </button>
          </div>
        )}

        {share.content_type === 'file' && share.file_url && (
          <div className="mb-6">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-3">
                <File className="w-8 h-8 text-gray-600" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {share.file_name}
                  </p>
                  {share.file_size && (
                    <p className="text-xs text-gray-500">
                      {(share.file_size / 1024).toFixed(2)} KB
                    </p>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={handleDownload}
              className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              <span>Download file</span>
            </button>
          </div>
        )}

        <button
          onClick={handleReset}
          className="w-full py-3 bg-gray-100 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 transition-colors font-medium"
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Retrieve Share</h2>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Enter passcode
        </label>
        <input
          type="text"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleRetrieve()}
          placeholder="Enter a 4- or 6-digit numeric passcode"
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-xl sm:text-2xl font-mono tracking-wider bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          maxLength={7}
        />
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>

      <button
        onClick={handleRetrieve}
        disabled={loading}
        className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Retrieving...' : 'Retrieve content'}
      </button>

      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <p className="text-sm text-amber-800">
          <strong>Tip:</strong> Each share can be retrieved only once; it will be destroyed immediately after retrieval.
        </p>
      </div>
    </div>
  );
}
