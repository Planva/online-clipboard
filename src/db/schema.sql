/*
  # OnlinClipboard 数据库表结构

  本迁移创建在线剪切板应用所需的所有表和索引

  ## 新建表

  ### 1. onlinclipboard_com_clipboard_shares
  存储用户创建的分享内容
  - `id` (TEXT, PRIMARY KEY) - 唯一标识符
  - `passcode` (TEXT, NOT NULL) - 提取口令（4位或6位数字）
  - `slug` (TEXT, UNIQUE, NOT NULL) - 分享链接的唯一标识
  - `content_type` (TEXT, NOT NULL) - 内容类型：text/image/file
  - `content_text` (TEXT) - 文本内容（仅text类型）
  - `file_url` (TEXT) - 文件访问URL（image/file类型）
  - `file_name` (TEXT) - 原始文件名
  - `file_size` (INTEGER) - 文件大小（字节）
  - `mime_type` (TEXT) - 文件MIME类型
  - `accessed` (INTEGER, DEFAULT 0) - 是否已被访问（0=未访问，1=已访问）
  - `created_at` (TEXT) - 创建时间
  - `expires_at` (TEXT, NOT NULL) - 过期时间（24小时后）

  ### 2. onlinclipboard_com_user_reviews
  存储用户评价
  - `id` (TEXT, PRIMARY KEY) - 唯一标识符
  - `rating` (INTEGER, NOT NULL) - 评分（1-5星）
  - `comment` (TEXT) - 评价内容（可选）
  - `ip_hash` (TEXT) - IP地址哈希（匿名化，防重复）
  - `created_at` (TEXT) - 创建时间

  ## 索引

  为了优化查询性能，创建以下索引：
  - passcode 索引 - 快速查找口令
  - slug 索引 - 快速查找分享链接
  - expires_at 索引 - 快速清理过期数据
  - accessed 索引 - 快速查找未访问的分享
  - rating 索引 - 按评分统计
  - created_at 索引 - 按时间排序

  ## 安全性

  - 使用 CHECK 约束确保评分在有效范围内（1-5）
  - 使用 CHECK 约束确保 content_type 只能是预定义的值
  - 所有时间戳使用 ISO 8601 格式

  ## 注意事项

  1. 数据清理：使用 Cron 任务定期清理过期数据（expires_at < now）
  2. 文件删除：清理数据库记录时，同时删除 R2 中的对应文件
  3. 访问控制：所有访问通过 Worker 层进行，不直接暴露数据库
*/

-- 创建分享记录表
CREATE TABLE IF NOT EXISTS onlinclipboard_com_clipboard_shares (
  id TEXT PRIMARY KEY,
  passcode TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content_type TEXT NOT NULL CHECK(content_type IN ('text', 'image', 'file')),
  content_text TEXT,
  file_url TEXT,
  file_name TEXT,
  file_size INTEGER,
  mime_type TEXT,
  accessed INTEGER DEFAULT 0 CHECK(accessed IN (0, 1)),
  created_at TEXT DEFAULT (datetime('now')),
  expires_at TEXT NOT NULL
);

-- 创建索引以优化查询性能
CREATE INDEX IF NOT EXISTS idx_shares_passcode
  ON onlinclipboard_com_clipboard_shares(passcode);

CREATE INDEX IF NOT EXISTS idx_shares_slug
  ON onlinclipboard_com_clipboard_shares(slug);

CREATE INDEX IF NOT EXISTS idx_shares_expires_at
  ON onlinclipboard_com_clipboard_shares(expires_at);

CREATE INDEX IF NOT EXISTS idx_shares_accessed
  ON onlinclipboard_com_clipboard_shares(accessed);

-- 创建用户评价表
CREATE TABLE IF NOT EXISTS onlinclipboard_com_user_reviews (
  id TEXT PRIMARY KEY,
  rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
  comment TEXT,
  ip_hash TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- 创建索引以优化评价查询
CREATE INDEX IF NOT EXISTS idx_reviews_rating
  ON onlinclipboard_com_user_reviews(rating);

CREATE INDEX IF NOT EXISTS idx_reviews_created_at
  ON onlinclipboard_com_user_reviews(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_reviews_ip_hash
  ON onlinclipboard_com_user_reviews(ip_hash);
