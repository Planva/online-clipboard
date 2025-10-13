import { useState, useEffect, useCallback } from 'react';
import { Star, ArrowLeft, Filter } from 'lucide-react';
import { api, Review, ReviewStats } from '../lib/api';

interface AllReviewsProps {
  onBack: () => void;
}

export function AllReviews({ onBack }: AllReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [stats, setStats] = useState<ReviewStats>({ average: 0, total: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } });

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.reviews.list({
        limit: 1000,
        rating: filterRating || undefined,
      });
      setReviews(data || []);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  }, [filterRating]);

  const fetchStats = useCallback(async () => {
    try {
      const data = await api.reviews.getStats();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
    fetchStats();
  }, [fetchReviews, fetchStats]);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const distribution = [stats.distribution[5], stats.distribution[4], stats.distribution[3], stats.distribution[2], stats.distribution[1]];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>返回</span>
        </button>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-8 mb-6 sm:mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">所有评价</h2>
            {stats.total > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
                    {stats.average.toFixed(1)}
                  </div>
                  <div>
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${
                            star <= Math.round(stats.average)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">基于 {stats.total} 条评价</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">评分分布</h3>
            </div>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating, idx) => {
                const count = distribution[idx];
                const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
                return (
                  <button
                    key={rating}
                    onClick={() => setFilterRating(filterRating === rating ? null : rating)}
                    className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors ${
                      filterRating === rating ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-1 w-20">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{rating}</span>
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    </div>
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">{count}</span>
                  </button>
                );
              })}
            </div>
            {filterRating && (
              <button
                onClick={() => setFilterRating(null)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mt-3"
              >
                清除筛选
              </button>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">加载中...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            {filterRating ? `暂无 ${filterRating} 星评价` : '暂无评价'}
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:gap-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= review.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(review.created_at)}
                </span>
              </div>
              {review.comment ? (
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{review.comment}</p>
              ) : (
                <p className="text-gray-400 dark:text-gray-500 italic">用户未留下评价内容</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
