import { useState, useEffect } from 'react';
import { Star, ChevronRight } from 'lucide-react';
import { api, Review, ReviewStats } from '../lib/api';

interface ReviewListProps {
  limit?: number;
  onViewAll?: () => void;
}

export function ReviewList({ limit = 10, onViewAll }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ReviewStats>({ average: 0, total: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } });

  useEffect(() => {
    fetchReviews();
    fetchStats();
  }, [limit]);

  const fetchReviews = async () => {
    try {
      const data = await api.reviews.list({ limit });
      setReviews(data || []);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await api.reviews.getStats();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return `${diffInHours}小时前`;
    } else if (diffInHours < 24 * 7) {
      return `${Math.floor(diffInHours / 24)}天前`;
    } else {
      return date.toLocaleDateString('zh-CN');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">加载中...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">用户评价</h3>
            {stats.total > 0 && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 sm:w-6 sm:h-6 fill-yellow-400 text-yellow-400" />
                  <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.average.toFixed(1)}
                  </span>
                </div>
                <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">基于 {stats.total} 条评价</span>
              </div>
            )}
          </div>
          {onViewAll && reviews.length >= limit && (
            <button
              onClick={onViewAll}
              className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
            >
              <span>查看全部</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {reviews.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">暂无评价，成为第一个评价的用户吧！</p>
        ) : (
          <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="flex-shrink-0 w-72 sm:w-80 bg-gray-50 dark:bg-gray-700 rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= review.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(review.created_at)}
                  </span>
                </div>
                {review.comment && (
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed line-clamp-4">
                    {review.comment}
                  </p>
                )}
                {!review.comment && (
                  <p className="text-gray-400 dark:text-gray-500 text-sm italic">用户未留下评价内容</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
