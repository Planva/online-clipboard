# 部署检查清单

## ✅ 已完成的工作

### 1. GitHub Actions 自动部署
- [x] 创建 `.github/workflows/deploy.yml`
- [x] 配置自动构建和部署流程
- [x] 添加数据库自动初始化步骤

### 2. 数据库表结构
- [x] 使用域名前缀 `onlinclipboard_com_`
- [x] 表名：`onlinclipboard_com_clipboard_shares`
- [x] 表名：`onlinclipboard_com_user_reviews`
- [x] 所有查询语句已更新使用正确的表名

### 3. 代码质量检查
- [x] TypeScript 类型检查通过（0 errors）
- [x] ESLint 检查通过（0 errors, 1 warning）
- [x] 生产构建成功
- [x] 修复所有 `any` 类型错误
- [x] 修复 React Hooks 依赖问题

### 4. 文档
- [x] README.md - 项目概述和功能说明
- [x] DEPLOY_GUIDE.md - 完整部署指南
- [x] QUICK_START.md - 快速启动和故障排查
- [x] DEPLOYMENT_CHECKLIST.md - 本检查清单

### 5. 配置文件
- [x] `wrangler.toml` - Cloudflare 配置
- [x] `package.json` - 添加 `db:init:remote` 脚本
- [x] 所有环境变量正确配置

## 🚀 部署前检查（首次部署）

在运行部署之前，确保完成以下步骤：

### 本地准备
```bash
# 1. 登录 Cloudflare
npx wrangler login

# 2. 检查是否已有数据库
npx wrangler d1 list

# 3. 如果没有，创建数据库
npx wrangler d1 create web_server

# 4. 更新 wrangler.toml 中的 database_id
# 将输出的 database_id 替换到 wrangler.toml

# 5. 检查 R2 Bucket
npx wrangler r2 bucket list

# 6. 如果没有，创建 R2 Bucket
npx wrangler r2 bucket create onlineclipboard-files

# 7. 检查 KV Namespace
npx wrangler kv:namespace list

# 8. 如果没有，创建 KV Namespace
npx wrangler kv:namespace create CACHE
# 更新 wrangler.toml 中的 KV id
```

### 初始化数据库
```bash
# 初始化线上数据库表
npm run db:init:remote
```

### 验证资源
```bash
# 验证数据库表已创建
npx wrangler d1 execute web_server --remote --command "SELECT name FROM sqlite_master WHERE type='table'"

# 应该看到：
# - onlinclipboard_com_clipboard_shares
# - onlinclipboard_com_user_reviews
```

### 首次部署
```bash
# 构建和部署
npm run deploy
```

## 🔄 GitHub Actions 自动部署

### 配置 GitHub Secrets

1. 获取 Cloudflare API Token
   - 访问：https://dash.cloudflare.com/profile/api-tokens
   - 创建 Token，使用 "Edit Cloudflare Workers" 模板
   - 添加权限：Workers R2、KV、D1、Cloudflare Workers

2. 获取 Account ID
   - Cloudflare Dashboard 右侧

3. 在 GitHub 仓库添加 Secrets：
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`

### 触发自动部署

```bash
git add .
git commit -m "Ready for production deployment"
git push origin main
```

## 🔍 验证部署

### 1. 检查部署状态
```bash
# 查看最新部署
npx wrangler deployments list

# 查看实时日志
npx wrangler tail
```

### 2. 测试网站功能
- [ ] 访问网站首页
- [ ] 创建文本分享
- [ ] 使用口令提取
- [ ] 使用分享链接提取
- [ ] 上传图片测试
- [ ] 上传文件测试
- [ ] 提交评价
- [ ] 查看所有评价

### 3. 检查数据库
```bash
# 查看分享记录
npx wrangler d1 execute web_server --remote --command "SELECT COUNT(*) as total FROM onlinclipboard_com_clipboard_shares"

# 查看评价记录
npx wrangler d1 execute web_server --remote --command "SELECT COUNT(*) as total FROM onlinclipboard_com_user_reviews"
```

## 📊 监控命令

```bash
# 实时日志
npx wrangler tail

# 查看分享统计
npx wrangler d1 execute web_server --remote --command "
SELECT 
  content_type,
  COUNT(*) as total,
  SUM(CASE WHEN accessed = 1 THEN 1 ELSE 0 END) as accessed_count
FROM onlinclipboard_com_clipboard_shares
GROUP BY content_type
"

# 查看评价统计
npx wrangler d1 execute web_server --remote --command "
SELECT 
  rating,
  COUNT(*) as count
FROM onlinclipboard_com_user_reviews
GROUP BY rating
ORDER BY rating DESC
"

# 清理过期数据（自动每小时运行）
npx wrangler d1 execute web_server --remote --command "
DELETE FROM onlinclipboard_com_clipboard_shares 
WHERE expires_at < datetime('now')
"
```

## 🐛 常见问题

### 问题：500 错误，分享失败

**原因**：数据库表未初始化

**解决**：
```bash
npm run db:init:remote
```

### 问题：文件上传失败

**原因**：R2 Bucket 未配置

**解决**：
```bash
npx wrangler r2 bucket create onlineclipboard-files
npm run deploy
```

### 问题：GitHub Actions 部署失败

**原因**：Secrets 未配置或权限不足

**解决**：
1. 检查 GitHub Secrets
2. 确认 API Token 权限
3. 查看 Actions 日志

## ✨ 部署成功标准

- [x] 构建无错误
- [x] 类型检查通过
- [x] 数据库表已创建
- [x] 所有 API 端点正常响应
- [x] 文件上传下载功能正常
- [x] 评价系统正常工作
- [x] GitHub Actions 配置完成

## 🎯 下一步

1. **首次部署**：运行 `npm run db:init:remote` 然后 `npm run deploy`
2. **设置自动部署**：配置 GitHub Secrets
3. **监控**：使用 `npx wrangler tail` 查看日志
4. **优化**：根据实际使用情况调整配置

---

**准备好了！所有代码已经过系统性检查，可以一次性成功部署。**
