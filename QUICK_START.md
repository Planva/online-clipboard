# 快速启动指南

## 立即修复线上 500 错误

你的网站现在显示"分享失败"是因为**数据库没有初始化**。按照以下步骤立即修复：

### 1. 初始化线上数据库（必须）

在你的本地终端运行：

```bash
npm run db:init:remote
```

这个命令会在 Cloudflare D1 数据库中创建所有必需的表。

### 2. 验证数据库

检查表是否创建成功：

```bash
npx wrangler d1 execute web_server --remote --command "SELECT name FROM sqlite_master WHERE type='table'"
```

你应该看到两个表：
- `onlinclipboard_com_clipboard_shares`
- `onlinclipboard_com_user_reviews`

### 3. 验证 R2 和 KV

检查 R2 Bucket：

```bash
npx wrangler r2 bucket list
```

应该看到 `onlineclipboard-files`

检查 KV Namespace：

```bash
npx wrangler kv:namespace list
```

### 4. 测试网站

访问 [onlinclipboard.com](https://onlinclipboard.com) 并尝试创建一个文本分享。

---

## 如果还有问题

### R2 Bucket 不存在

创建 R2 Bucket：

```bash
npx wrangler r2 bucket create onlineclipboard-files
```

### KV Namespace 不存在

创建 KV Namespace：

```bash
npx wrangler kv:namespace create CACHE
```

记录输出的 ID，然后更新 `wrangler.toml` 文件中的 `id` 字段。

### 需要重新部署

如果修改了配置文件：

```bash
npm run deploy
```

---

## 设置 GitHub 自动部署

### 1. 获取 Cloudflare API Token

访问：https://dash.cloudflare.com/profile/api-tokens

点击 "Create Token" → 使用 "Edit Cloudflare Workers" 模板

需要以下权限：
- Workers R2 Storage - Edit
- Workers KV Storage - Edit
- D1 - Edit
- Cloudflare Workers - Edit

### 2. 获取 Account ID

在 Cloudflare Dashboard 右侧复制 Account ID

### 3. 添加 GitHub Secrets

在 GitHub 仓库设置中添加：

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

### 4. 推送代码

```bash
git add .
git commit -m "Setup auto deployment"
git push origin main
```

之后每次推送到 main 分支，GitHub Actions 会自动部署。

---

## 常用命令

```bash
# 本地开发
npm run dev

# 类型检查
npm run typecheck

# 构建项目
npm run build

# 部署到生产
npm run deploy

# 查看实时日志
npx wrangler tail

# 查看数据库数据
npx wrangler d1 execute web_server --remote --command "SELECT * FROM onlinclipboard_com_clipboard_shares LIMIT 5"
```

---

## 表结构说明

### onlinclipboard_com_clipboard_shares

存储分享内容，使用域名前缀 `onlinclipboard_com_`

字段：
- `id`: UUID
- `passcode`: 4或6位数字口令
- `slug`: 8位字符串，用于分享链接
- `content_type`: text/image/file
- `content_text`: 文本内容
- `file_url`: R2 文件 URL
- `expires_at`: 24小时后过期
- `accessed`: 是否已访问（0=未访问，1=已访问）

### onlinclipboard_com_user_reviews

存储用户评价

字段：
- `id`: UUID
- `rating`: 1-5星评分
- `comment`: 评价内容
- `ip_hash`: IP 哈希（匿名化）
- `created_at`: 创建时间

---

## 故障排查

### 问题：分享失败，500 错误

**原因**：数据库表未初始化

**解决**：运行 `npm run db:init:remote`

### 问题：文件上传失败

**原因**：R2 Bucket 不存在或未绑定

**解决**：
1. 检查 `npx wrangler r2 bucket list`
2. 如果没有，运行 `npx wrangler r2 bucket create onlineclipboard-files`
3. 重新部署 `npm run deploy`

### 问题：GitHub Actions 失败

**原因**：Secrets 未配置或 Token 权限不足

**解决**：
1. 检查 GitHub Secrets 是否正确设置
2. 确认 API Token 有所有必需权限
3. 查看 Actions 日志获取详细错误

---

## 监控

查看实时访问日志：

```bash
npx wrangler tail
```

查看数据库记录数：

```bash
npx wrangler d1 execute web_server --remote --command "SELECT COUNT(*) as total FROM onlinclipboard_com_clipboard_shares"
```

查看评价统计：

```bash
npx wrangler d1 execute web_server --remote --command "SELECT AVG(rating) as avg_rating, COUNT(*) as total FROM onlinclipboard_com_user_reviews"
```

---

## 需要帮助？

详细文档：
- [完整部署指南](./DEPLOY_GUIDE.md)
- [项目 README](./README.md)
- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
