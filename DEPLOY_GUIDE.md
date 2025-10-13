# 部署指南

本指南将帮助你从头到尾部署 OnlinClipboard 到 Cloudflare。

## 前置要求

- Node.js 18+
- npm 或 pnpm
- Cloudflare 账号
- GitHub 账号（用于自动部署）

## 本地部署步骤

### 1. 安装依赖

```bash
npm install
```

### 2. 登录 Cloudflare

```bash
npx wrangler login
```

这会在浏览器中打开 Cloudflare 登录页面。

### 3. 创建 D1 数据库

```bash
npx wrangler d1 create web_server
```

复制输出的 `database_id`，更新 `wrangler.toml` 中的 `database_id`。

### 4. 初始化数据库表

```bash
npx wrangler d1 execute web_server --remote --file=./src/db/schema.sql
```

### 5. 创建 R2 Bucket

```bash
npx wrangler r2 bucket create onlineclipboard-files
```

### 6. 创建 KV Namespace

```bash
npx wrangler kv:namespace create CACHE
```

复制输出的 `id`，更新 `wrangler.toml` 中的 KV namespace `id`。

### 7. 构建和部署

```bash
npm run build
npm run deploy
```

## GitHub Actions 自动部署

### 1. 获取 Cloudflare API Token

1. 访问 [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. 点击 "Create Token"
3. 使用 "Edit Cloudflare Workers" 模板
4. 添加以下权限：
   - Account - Workers R2 Storage - Edit
   - Account - Workers KV Storage - Edit
   - Account - D1 - Edit
   - Account - Cloudflare Workers - Edit
5. 复制生成的 Token

### 2. 获取 Account ID

1. 访问 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 选择你的账号
3. 在右侧找到 "Account ID"，点击复制

### 3. 配置 GitHub Secrets

在你的 GitHub 仓库中：

1. 进入 Settings → Secrets and variables → Actions
2. 添加以下 secrets：
   - `CLOUDFLARE_API_TOKEN`: 刚才创建的 API Token
   - `CLOUDFLARE_ACCOUNT_ID`: 你的 Account ID

### 4. 首次部署

在本地完成以上所有步骤（创建数据库、R2、KV）后，推送代码到 GitHub：

```bash
git add .
git commit -m "Initial deployment setup"
git push origin main
```

GitHub Actions 会自动运行，部署你的应用。

### 5. 后续部署

每次推送到 `main` 分支时，GitHub Actions 都会自动：
1. 构建项目
2. 初始化/更新数据库表（使用 IF NOT EXISTS，安全的）
3. 部署到 Cloudflare Workers

## 验证部署

部署完成后，访问 Cloudflare Workers 提供的 URL：

```
https://onlineclipboard.YOUR_SUBDOMAIN.workers.dev
```

或者绑定自定义域名：

```bash
npx wrangler domains add onlineclipboard.com
```

## 常见问题

### Q: 数据库表名使用了什么前缀？

A: 所有表都使用 `onlinclipboard_com_` 前缀：
- `onlinclipboard_com_clipboard_shares`
- `onlinclipboard_com_user_reviews`

### Q: 如何查看线上数据库的数据？

```bash
npx wrangler d1 execute web_server --remote --command "SELECT * FROM onlinclipboard_com_clipboard_shares LIMIT 10"
```

### Q: 如何查看部署日志？

```bash
npx wrangler tail
```

### Q: GitHub Actions 失败了怎么办？

1. 检查 Secrets 是否正确配置
2. 确保 API Token 有足够的权限
3. 查看 Actions 日志获取具体错误信息

### Q: 如何更新数据库结构？

修改 `src/db/schema.sql`，然后：

```bash
npx wrangler d1 execute web_server --remote --file=./src/db/schema.sql
```

注意：所有表都使用 `CREATE TABLE IF NOT EXISTS`，所以重复运行是安全的。

## 监控和维护

### 查看实时日志

```bash
npx wrangler tail
```

### 查看数据库统计

```bash
npx wrangler d1 execute web_server --remote --command "SELECT COUNT(*) as total FROM onlinclipboard_com_clipboard_shares"
```

### 清理过期数据

系统会每小时自动清理过期的分享（通过 Cron 任务）。

手动触发清理：

```bash
npx wrangler d1 execute web_server --remote --command "DELETE FROM onlinclipboard_com_clipboard_shares WHERE expires_at < datetime('now')"
```

## 资源限制

- D1 数据库：每天 5GB 读取，100K 写入（免费计划）
- R2 存储：10GB 存储，1M 写入操作（免费计划）
- Workers：每天 100,000 请求（免费计划）
- 文件大小：最大 300 MB

## 技术支持

如有问题，请查看：
- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- [D1 数据库文档](https://developers.cloudflare.com/d1/)
- [R2 存储文档](https://developers.cloudflare.com/r2/)
