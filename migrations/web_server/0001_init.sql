PRAGMA foreign_keys = ON;

-- 分享表：与你的 queries.js 中字段完全对齐
CREATE TABLE IF NOT EXISTS onlinclipboard_com_clipboard_shares (
  id           TEXT PRIMARY KEY,
  passcode     TEXT NOT NULL,
  slug         TEXT NOT NULL,
  content_type TEXT NOT NULL,              -- 'text' | 'image' | 'file'
  content_text TEXT,                        -- 文本分享时使用
  file_url     TEXT,                        -- 文件/图片分享时：指向 /api/files/<key> 的 URL
  file_name    TEXT,
  file_size    INTEGER,
  mime_type    TEXT,
  accessed     INTEGER NOT NULL DEFAULT 0,  -- 0: 未领取；1: 已领取（一次性领取场景）
  expires_at   TEXT NOT NULL,               -- ISO8601 字符串（与你代码中比较 now.toISOString() 一致）
  created_at   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_shares_slug ON onlinclipboard_com_clipboard_shares (slug);
CREATE INDEX IF NOT EXISTS idx_shares_passcode ON onlinclipboard_com_clipboard_shares (passcode);
CREATE INDEX IF NOT EXISTS idx_shares_expires ON onlinclipboard_com_clipboard_shares (expires_at);
CREATE INDEX IF NOT EXISTS idx_shares_accessed ON onlinclipboard_com_clipboard_shares (accessed);

-- 评价表：与你的 queries.js 中字段完全对齐
CREATE TABLE IF NOT EXISTS onlinclipboard_com_user_reviews (
  id         TEXT PRIMARY KEY,
  rating     INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment    TEXT,
  ip_hash    TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE INDEX IF NOT EXISTS idx_reviews_created ON onlinclipboard_com_user_reviews (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_rating  ON onlinclipboard_com_user_reviews (rating);
