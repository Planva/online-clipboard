-- migrations/web_server/0002_seed.sql

-- 示例：配置表
CREATE TABLE IF NOT EXISTS app_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- 幂等插入：不存在才插
INSERT OR IGNORE INTO app_config (key, value)
VALUES ('max_file_size', '314572800');

-- 如果是需要更新而不是只插入：
-- INSERT INTO app_config (key, value) VALUES ('max_file_size', '314572800')
-- ON CONFLICT(key) DO UPDATE SET value=excluded.value;
