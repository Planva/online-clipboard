import { useState } from 'react';
import { Copy, FileUp, Image, Type, Clipboard, Link as LinkIcon } from 'lucide-react';
import { api } from '../lib/api';
import { formatPasscode } from '../utils/passcode';

interface ShareResult {
  passcode: string;
  slug: string;
  expiresAt: string;
}

interface ShareCreateProps {
  initialType?: 'text' | 'image' | 'file' | null;
  onTypeChange?: (type: 'text' | 'image' | 'file') => void;
}

export function ShareCreate({ initialType, onTypeChange }: ShareCreateProps) {
  const [contentType, setContentType] = useState<'text' | 'image' | 'file'>(initialType || 'text');
  const [textContent, setTextContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ShareResult | null>(null);
  const [passcodeLength, setPasscodeLength] = useState<4 | 6>(6);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setTextContent(text);
    } catch (err) {
      console.error('Failed to read clipboard:', err);
      alert('无法读取剪切板。请手动粘贴或授予剪切板权限。');
    }
  };

  const handlePasteImageFromClipboard = async () => {
    try {
      const items = await navigator.clipboard.read();
      for (const item of items) {
        for (const type of item.types) {
          if (type.startsWith('image/')) {
            const blob = await item.getType(type);
            const file = new File([blob], `clipboard-image.${type.split('/')[1]}`, { type });
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onload = (e) => setImagePreview(e.target?.result as string);
            reader.readAsDataURL(file);
            return;
          }
        }
      }
      alert('剪切板中没有图像');
    } catch (err) {
      console.error('Failed to read clipboard:', err);
      alert('无法读取剪切板。请手动选择文件或授予剪切板权限。');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (contentType === 'image' && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    }
  };

  const handleShare = async () => {
    if (contentType === 'text' && !textContent.trim()) {
      alert('请输入文本内容');
      return;
    }

    if ((contentType === 'image' || contentType === 'file') && !selectedFile) {
      alert('请选择文件');
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    try {
      const maxFileSize = 300 * 1024 * 1024;

      if (selectedFile && selectedFile.size > maxFileSize) {
        alert(`文件大小超过限制。当前文件: ${(selectedFile.size / 1024 / 1024).toFixed(2)} MB，最大支持: 300 MB`);
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('content_type', contentType);
      formData.append('passcode_length', passcodeLength.toString());

      if (contentType === 'text') {
        formData.append('content_text', textContent);
      }

      if (selectedFile) {
        const fileSizeMB = selectedFile.size / (1024 * 1024);
        const estimatedTime = Math.max(2000, fileSizeMB * 500);

        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) return prev;
            return prev + 10;
          });
        }, estimatedTime / 10);

        formData.append('file', selectedFile);

        const data = await api.shares.create(formData);

        clearInterval(progressInterval);
        setUploadProgress(100);

        setResult({
          passcode: data.passcode,
          slug: data.slug,
          expiresAt: data.expires_at,
        });
      } else {
        const data = await api.shares.create(formData);

        setResult({
          passcode: data.passcode,
          slug: data.slug,
          expiresAt: data.expires_at,
        });
      }

      setTextContent('');
      setSelectedFile(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Error creating share:', error);
      alert('分享失败，请重试');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const copyPasscode = () => {
    if (result) {
      navigator.clipboard.writeText(result.passcode);
      alert('口令已复制到剪切板');
    }
  };

  const copyShareLink = () => {
    if (result) {
      const shareUrl = `${window.location.origin}${window.location.pathname}?s=${result.slug}`;
      navigator.clipboard.writeText(shareUrl);
      alert('分享链接已复制到剪切板');
    }
  };

  if (result) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-8 max-w-md w-full">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Copy className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">分享成功</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">内容已加密保存，接收一次后自动删除</p>

          <div className="space-y-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">提取口令</p>
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-4xl font-mono font-bold text-gray-900 dark:text-white">
                  {formatPasscode(result.passcode)}
                </span>
                <button
                  onClick={copyPasscode}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  title="复制口令"
                >
                  <Copy className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                有效期至 {new Date(result.expiresAt).toLocaleString('zh-CN')}
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-blue-900 dark:text-blue-300 font-medium">分享链接</p>
                <LinkIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 mb-3 break-all text-sm text-gray-700 dark:text-gray-300 font-mono">
                {window.location.origin}?s={result.slug}
              </div>
              <button
                onClick={copyShareLink}
                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Copy className="w-4 h-4" />
                <span>复制链接</span>
              </button>
            </div>
          </div>

          <button
            onClick={() => setResult(null)}
            className="w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
          >
            继续分享
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-8 max-w-md w-full">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">创建分享</h2>

      <div className="mb-6">
        <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">分享类型</label>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <button
            onClick={() => {
              setContentType('text');
              if (onTypeChange) onTypeChange('text');
            }}
            className={`p-3 sm:p-4 rounded-xl border-2 transition-all ${
              contentType === 'text'
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 dark:border-gray-600'
            }`}
          >
            <Type className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2 text-gray-900 dark:text-gray-300" />
            <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-300">文字</span>
          </button>
          <button
            onClick={() => {
              setContentType('image');
              if (onTypeChange) onTypeChange('image');
            }}
            className={`p-3 sm:p-4 rounded-xl border-2 transition-all ${
              contentType === 'image'
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 dark:border-gray-600'
            }`}
          >
            <Image className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2 text-gray-900 dark:text-gray-300" />
            <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-300">图像</span>
          </button>
          <button
            onClick={() => {
              setContentType('file');
              if (onTypeChange) onTypeChange('file');
            }}
            className={`p-3 sm:p-4 rounded-xl border-2 transition-all ${
              contentType === 'file'
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 dark:border-gray-600'
            }`}
          >
            <FileUp className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2 text-gray-900 dark:text-gray-300" />
            <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-300">文件</span>
          </button>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">口令长度</label>
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <button
            onClick={() => setPasscodeLength(4)}
            className={`p-2 sm:p-3 rounded-xl border-2 transition-all ${
              passcodeLength === 4
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 dark:border-gray-600'
            }`}
          >
            <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-300">4位口令</span>
          </button>
          <button
            onClick={() => setPasscodeLength(6)}
            className={`p-2 sm:p-3 rounded-xl border-2 transition-all ${
              passcodeLength === 6
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 dark:border-gray-600'
            }`}
          >
            <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-300">6位口令</span>
          </button>
        </div>
      </div>

      {contentType === 'text' && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">文本内容</label>
            <button
              onClick={handlePasteFromClipboard}
              className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              <Clipboard className="w-4 h-4" />
              <span>从剪切板粘贴</span>
            </button>
          </div>
          <textarea
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            placeholder="输入或粘贴要分享的文本..."
            className="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>
      )}

      {contentType === 'image' && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">选择图像</label>
            <button
              onClick={handlePasteImageFromClipboard}
              className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              <Clipboard className="w-4 h-4" />
              <span>从剪切板粘贴</span>
            </button>
          </div>
          <input
            type="file"
            onChange={handleFileSelect}
            accept="image/*"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          {imagePreview && (
            <div className="mt-4">
              <img src={imagePreview} alt="预览" className="w-full rounded-xl border border-gray-200 dark:border-gray-700" />
            </div>
          )}
          {selectedFile && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              已选择: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>
      )}

      {contentType === 'file' && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">选择文件</label>
          <input
            type="file"
            onChange={handleFileSelect}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          {selectedFile && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                已选择: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            </div>
          )}
          {loading && uploadProgress > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>上传进度</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                文件越大需要的时间越长，请耐心等待...
              </p>
            </div>
          )}
        </div>
      )}

      <button
        onClick={handleShare}
        disabled={loading}
        className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? '创建中...' : '创建分享'}
      </button>

      <div className="mt-4 space-y-2">
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center">
          分享内容将在24小时后自动删除，接收一次后立即删除
        </p>
        <p className="text-xs sm:text-sm text-amber-600 text-center">
          文件大小限制：300 MB
        </p>
      </div>
    </div>
  );
}
