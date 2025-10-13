# OnlinClipboard - Cloudflare Workers 部署指南

本项目已成功从 Supabase 迁移到 Cloudflare Workers + D1 + R2 架构。

## 架构说明

- **Cloudflare Workers**: 处理所有 API 请求和静态资源服务
- **D1 数据库**: 存储分享记录和用户评价
- **R2 存储**: 存储用户上传的文件（最大 300MB）
- **KV 缓存**: 缓存评价统计数据
- **Cron Triggers**: 每小时自动清理过期数据

## 已配置的服务

1. **D1 数据库**
   - Database ID: `7a6c36d2-169d-43de-8288-55376054f92f`
   - Database Name: `web_server`
   - 表前缀: `onlinclipboard_com_`

2. **R2 存储桶**
   - Bucket Name: `onlineclipboard-files`

3. **KV 命名空间**
   - Namespace ID: `3050911dfcbe404c8b87871ebba2ed9f`

4. **域名**
   - `onlinclipboard.com` (不含 www)

## 初始化数据库

**重要**: 首次部署前必须初始化数据库表结构！

### 方法 1: 使用 npm 脚本（推荐）

```bash
npm install
npm run db:init
```

### 方法 2: 直接使用 wrangler

```bash
wrangler d1 execute web_server --file=./src/db/schema.sql
```

### 方法 3: 在 Cloudflare Dashboard 中手动执行

1. 登录 Cloudflare Dashboard
2. 进入 Workers & Pages → D1
3. 选择 `web_server` 数据库
4. 在 Console 中执行 `src/db/schema.sql` 文件中的 SQL 语句

## 自动部署（GitHub Actions）

项目已配置 GitHub Actions，当推送到 `main` 分支时自动部署。

### 前置条件

确保在 GitHub 仓库的 Settings → Secrets and variables → Actions 中已添加：

- `CLOUDFLARE_API_TOKEN` ✅ 已配置
- `CLOUDFLARE_ACCOUNT_ID` ✅ 已配置

### 触发部署

```bash
git add .
git commit -m "Deploy to Cloudflare Workers"
git push origin main
```

部署过程会自动：
1. 安装依赖
2. 构建前端
3. 部署到 Cloudflare Workers
4. 配置域名（如已设置）

## 本地开发

### 安装依赖

```bash
npm install
```

### 启动本地开发服务器

```bash
npm run dev
```

### 本地测试 Worker

```bash
wrangler dev
```

## 手动部署

如需手动部署：

```bash
npm run deploy
```

这会：
1. 构建前端资源
2. 部署到 Cloudflare Workers

## 项目结构

```
onlineclipboard/
├── src/
│   ├── worker/              # Cloudflare Worker 代码
│   │   ├── index.js         # Worker 入口
│   │   ├── api/             # API 处理器
│   │   │   ├── shares.js    # 分享相关 API
│   │   │   ├── reviews.js   # 评价相关 API
│   │   │   └── files.js     # 文件访问 API
│   │   ├── db/              # 数据库操作
│   │   │   ├── schema.sql   # 数据库表结构
│   │   │   └── queries.js   # 数据库查询函数
│   │   ├── storage/         # R2 存储操作
│   │   │   └── r2.js
│   │   └── utils/           # 工具函数
│   │       ├── validation.js
│   │       ├── generators.js
│   │       └── cors.js
│   ├── components/          # React 组件
│   ├── lib/                 # 前端库
│   │   └── api.ts           # API 客户端
│   └── ...
├── wrangler.toml            # Cloudflare 配置
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Actions 配置
└── package.json

## API 端点

### 分享相关
- `POST /api/shares` - 创建分享
- `GET /api/shares/by-passcode/:passcode` - 通过口令获取
- `GET /api/shares/by-slug/:slug` - 通过链接获取

### 评价相关
- `POST /api/reviews` - 提交评价
- `GET /api/reviews` - 获取评价列表
- `GET /api/reviews/stats` - 获取评价统计

### 文件访问
- `GET /api/files/:key` - 获取文件

## 功能特性

- ✅ 文本、图片、文件分享（最大 300MB）
- ✅ 4位或6位口令保护
- ✅ 分享链接（slug）
- ✅ 一次性访问（访问后自动删除）
- ✅ 24小时自动过期
- ✅ 用户评价系统
- ✅ 匿名 IP 哈希（保护隐私）
- ✅ 每小时自动清理过期数据
- ✅ 深色模式支持

## 监控和维护

### 查看部署状态

访问 Cloudflare Dashboard → Workers & Pages

### 查看日志

```bash
wrangler tail
```

### 查看数据库

```bash
wrangler d1 execute web_server --command="SELECT COUNT(*) FROM onlinclipboard_com_clipboard_shares"
```

### 清理过期数据

Cron 任务每小时自动运行，无需手动清理。

## 域名配置

在 Cloudflare Dashboard 中：
1. Workers & Pages → 选择 `onlineclipboard`
2. Settings → Domains & Routes
3. 添加域名: `onlinclipboard.com`
4. 配置 DNS 记录（自动完成）

## 性能优化

- KV 缓存用于评价统计（5分钟 TTL）
- R2 文件使用 CDN 缓存（1小时）
- 静态资源构建优化
- 全球边缘网络部署

## 故障排查

### 部署失败

1. 检查 GitHub Secrets 是否正确配置
2. 查看 GitHub Actions 日志
3. 确认 wrangler.toml 配置正确

### 数据库错误

1. 确认数据库已初始化：`npm run db:init`
2. 检查表是否存在
3. 验证 Database ID 正确

### 文件上传失败

1. 检查文件大小（≤ 300MB）
2. 确认 R2 存储桶存在
3. 验证 wrangler.toml 中的 R2 配置

## 迁移变更

从 Supabase 到 Cloudflare 的主要变更：

1. **移除的依赖**: `@supabase/supabase-js`
2. **新增的依赖**: `wrangler`
3. **文件大小限制**: 45MB → 300MB
4. **数据库**: PostgreSQL (Supabase) → SQLite (D1)
5. **存储**: Supabase Storage → Cloudflare R2
6. **认证**: 所有 API 请求通过 Worker 处理，IP 哈希在服务端完成

## 支持

如有问题，请查看：
- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- [D1 数据库文档](https://developers.cloudflare.com/d1/)
- [R2 存储文档](https://developers.cloudflare.com/r2/)
