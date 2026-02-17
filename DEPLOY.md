# OFT Bridge — Vercel 部署指南

本指南提供两种部署方式：**方式一（推荐）**通过 GitHub 连接，5分钟完成；**方式二**通过 Vercel CLI 命令行部署。

---

## 方式一：GitHub 连接自动部署（推荐）

这是最简单的方式，配置完成后每次 `git push` 即可自动重新部署。

### 第 1 步：将代码推送到 GitHub

```bash
# 解压项目
unzip oft-bridge-project.zip
cd oft-bridge

# 初始化 Git
git init
git add .
git commit -m "feat: initial OFT Bridge"

# 在 GitHub 新建一个仓库，然后：
git remote add origin https://github.com/你的用户名/oft-bridge.git
git branch -M main
git push -u origin main
```

### 第 2 步：在 Vercel 导入项目

1. 打开 [vercel.com/new](https://vercel.com/new)
2. 点击 **「Import Git Repository」**
3. 选择刚刚创建的 `oft-bridge` 仓库
4. Vercel 会自动识别 Next.js 框架

### 第 3 步：配置环境变量（关键）

在 Vercel 导入界面的 **Environment Variables** 部分，添加以下变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | `你的Project ID` | 从 [cloud.walletconnect.com](https://cloud.walletconnect.com) 获取 |

> **获取 WalletConnect Project ID：**
> 1. 访问 https://cloud.walletconnect.com
> 2. 注册/登录后点击 **「+ New Project」**
> 3. 输入项目名称，选择 **「AppKit」**
> 4. 复制 **Project ID**

### 第 4 步：点击 Deploy 🚀

点击 **「Deploy」** 按钮，等待约 1-2 分钟，部署完成后会获得形如 `oft-bridge-xxx.vercel.app` 的域名。

---

## 方式二：Vercel CLI 命令行部署

适合不想使用 GitHub 或需要手动控制部署的场景。

### 第 1 步：安装 Vercel CLI

```bash
npm install -g vercel
```

### 第 2 步：登录 Vercel

```bash
vercel login
# 选择邮箱、GitHub、GitLab 或 Bitbucket 登录
```

### 第 3 步：进入项目目录并部署

```bash
cd oft-bridge
vercel
```

CLI 会交互式询问：

```
? Set up and deploy "oft-bridge"? → Y
? Which scope? → 选择你的账户
? Link to existing project? → N（首次部署）
? What's your project's name? → oft-bridge
? In which directory is your code located? → ./
? Want to modify settings? → N
```

### 第 4 步：添加环境变量

```bash
vercel env add NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
# 输入你的 WalletConnect Project ID
# 选择环境: Production, Preview, Development (全选)
```

### 第 5 步：部署到生产环境

```bash
vercel --prod
```

输出示例：
```
✅  Production: https://oft-bridge-xxx.vercel.app [1m 23s]
```

---

## 方式三：GitHub Actions 自动 CI/CD

项目已包含 `.github/workflows/deploy.yml`，配置后每次推送自动部署。

### 配置步骤

**1. 获取 Vercel Token**
- 访问 [vercel.com/account/tokens](https://vercel.com/account/tokens)
- 点击 **「Create」**，输入名称，选择过期时间
- 复制生成的 Token

**2. 获取 Vercel IDs**

```bash
cd oft-bridge
vercel link   # 关联项目（会生成 .vercel/project.json）
cat .vercel/project.json
# 输出: { "orgId": "xxx", "projectId": "yyy" }
```

**3. 在 GitHub 添加 Secrets**

进入 GitHub 仓库 → Settings → Secrets and variables → Actions → New repository secret：

| Secret 名称 | 值来源 |
|------------|--------|
| `VERCEL_TOKEN` | 步骤1获取的Token |
| `VERCEL_ORG_ID` | `project.json` 中的 `orgId` |
| `VERCEL_PROJECT_ID` | `project.json` 中的 `projectId` |

**4. 推送代码触发部署**

```bash
git push origin main
# → GitHub Actions 自动构建并部署到生产环境
```

PR 部署：
```bash
git checkout -b feature/my-feature
git push origin feature/my-feature
# → 自动生成预览 URL，并在 PR 中评论
```

---

## 添加自定义域名

```bash
# CLI 方式
vercel domains add yourdomain.com

# 或在 Vercel Dashboard：
# 项目设置 → Domains → Add Domain
```

然后在你的域名 DNS 面板添加：
- **A 记录**：`@` → `76.76.21.21`
- **CNAME 记录**：`www` → `cname.vercel-dns.com`

---

## 更新环境变量

```bash
# 修改已有变量
vercel env rm NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID production
vercel env add NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID production

# 或在 Dashboard：项目 → Settings → Environment Variables
```

更新后需要重新部署使变量生效：

```bash
vercel --prod
```

---

## 常见问题

**Q: 构建失败，报 `Module not found` 错误**
```bash
# 确保 node_modules 没有被提交，在本地先验证构建
npm install && npm run build
```

**Q: 运行时报 `WalletConnect not initialized`**
- 检查 `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` 是否正确添加
- 在 Vercel Dashboard 的 Environment Variables 确认变量存在

**Q: 跨链报价失败（RPC 错误）**
- 默认使用公共 RPC，可能有请求限制
- 推荐添加私有 RPC：在 Vercel 添加 `NEXT_PUBLIC_RPC_ETHEREUM` 等变量

**Q: 部署后页面空白**
```bash
# 查看函数日志
vercel logs your-deployment-url.vercel.app
```

---

## 快速参考命令

```bash
vercel                    # 部署到预览环境
vercel --prod             # 部署到生产环境
vercel logs <url>         # 查看日志
vercel env ls             # 列出环境变量
vercel domains ls         # 列出域名
vercel rollback           # 回滚到上一个部署
vercel open               # 在浏览器打开项目
```
