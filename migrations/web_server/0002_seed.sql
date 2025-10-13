-- 评价的演示数据，方便你一眼看出 /api/reviews 与 /api/reviews/stats 是否恢复
INSERT OR IGNORE INTO onlinclipboard_com_user_reviews (id, rating, comment)
VALUES
  ('seed-1', 5, '很方便！'),
  ('seed-2', 4, '界面清爽。');
