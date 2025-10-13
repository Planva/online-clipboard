# OnlinClipboard - 在线剪贴板

一个安全、简单的在线剪贴板应用，支持文本、图片和文件分享。基于 Cloudflare Workers、D1 数据库和 R2 存储构建。

## 功能特性

- **多种分享类型**：文本、图片、文件
- **安全加密**：4位或6位数字口令
- **自动过期**：24小时后自动删除
- **一次性访问**：接收后立即销毁
- **文件支持**：最大支持 300 MB
- **用户评价**：5星评价系统
- **深色模式**：自动适配系统主题
- **响应式设计**：完美支持移动端

## 技术栈

- **前端**：React 18 + TypeScript + Tailwind CSS + Vite
- **后端**：Cloudflare Workers
- **数据库**：Cloudflare D1 (SQLite)
- **存储**：Cloudflare R2
- **缓存**：Cloudflare KV
- **部署**：GitHub Actions

## 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 初始化本地数据库
npm run db:init
```

### 部署到生产环境

详细部署指南请查看 [DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md)

快速部署步骤：

```bash
# 1. 登录 Cloudflare
npx wrangler login

# 2. 创建资源（仅首次）
npx wrangler d1 create web_server
npx wrangler r2 bucket create onlineclipboard-files
npx wrangler kv:namespace create CACHE

# 3. 初始化线上数据库
npm run db:init:remote

# 4. 部署
npm run deploy
```

## 项目结构

```
onlineclipboard/
├── src/
│   ├── components/          # React 组件
│   ├── contexts/           # React Context
│   ├── lib/                # API 客户端
│   ├── pages/              # 页面组件
│   ├── utils/              # 工具函数
│   ├── worker/             # Cloudflare Worker
│   │   ├── api/           # API 处理器
│   │   ├── db/            # 数据库查询
│   │   ├── storage/       # R2 文件存储
│   │   └── utils/         # Worker 工具
│   └── db/                 # 数据库 Schema
├── .github/
│   └── workflows/          # GitHub Actions
├── wrangler.toml           # Cloudflare 配置
└── package.json
```

## 数据库表结构

### onlinclipboard_com_clipboard_shares

存储分享内容，表名使用域名前缀 `onlinclipboard_com_`。

- `id`: 唯一标识符
- `passcode`: 提取口令（4或6位数字）
- `slug`: 分享链接标识
- `content_type`: 内容类型（text/image/file）
- `content_text`: 文本内容
- `file_url`: 文件访问 URL
- `expires_at`: 过期时间（24小时）
- `accessed`: 是否已访问

### onlinclipboard_com_user_reviews

存储用户评价。

- `id`: 唯一标识符
- `rating`: 评分（1-5星）
- `comment`: 评价内容
- `ip_hash`: IP 哈希（防重复）
- `created_at`: 创建时间

## API 端点

### 分享 API

- `POST /api/shares` - 创建分享
- `GET /api/shares/by-passcode/:passcode` - 通过口令获取
- `GET /api/shares/by-slug/:slug` - 通过链接获取

### 评价 API

- `POST /api/reviews` - 提交评价
- `GET /api/reviews` - 获取评价列表
- `GET /api/reviews/stats` - 获取评价统计

### 文件 API

- `GET /api/files/:key` - 获取文件

## 环境变量

配置在 `wrangler.toml`：

```toml
[vars]
MAX_FILE_SIZE = 314572800       # 300 MB
DOMAIN_PREFIX = "onlinclipboard_com"
```

## 自动部署

推送到 `main` 分支时自动部署：

1. 构建项目
2. 初始化/更新数据库
3. 部署到 Cloudflare Workers

需要配置 GitHub Secrets：
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！
