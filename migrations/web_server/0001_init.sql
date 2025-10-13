-- migrations/web_server/0001_init.sql

PRAGMA foreign_keys = ON;

-- 举例：文件元数据表
CREATE TABLE IF NOT EXISTS files (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  size INTEGER NOT NULL,
  content_type TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP
);

-- 举例：剪贴板内容表
CREATE TABLE IF NOT EXISTS clips (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  type TEXT NOT NULL, -- text / image / file
  expires_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 索引示例（IF NOT EXISTS 防止重复）
CREATE INDEX IF NOT EXISTS idx_clips_expires ON clips (expires_at);
