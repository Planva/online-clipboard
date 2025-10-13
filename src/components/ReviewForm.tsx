import { useState } from 'react';
import { Star } from 'lucide-react';
import { api } from '../lib/api';

interface ReviewFormProps {
  onSuccess?: () => void;
}

export function ReviewForm({ onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      setError('请选择评分');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.reviews.create({
        rating,
        comment: comment.trim() || undefined,
      });

      setRating(0);
      setComment('');
      alert('感谢您的评价！');

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setError(err instanceof Error ? err.message : '提交失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">分享您的体验</h3>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          评分
        </label>
        <div className="flex gap-1 sm:gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="transition-transform hover:scale-110"
            >
              <Star
                className={`w-8 h-8 ${
                  star <= (hoverRating || rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          评价内容（可选）
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="分享您使用在线剪切板的感受..."
          rows={4}
          maxLength={500}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{comment.length}/500</p>
      </div>

      {error && (
        <p className="text-sm text-red-600 mb-4">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? '提交中...' : '提交评价'}
      </button>

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
        所有评价均匿名提交，保护您的隐私
      </p>
    </form>
  );
}
