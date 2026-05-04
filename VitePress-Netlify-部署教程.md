# VitePress 博客部署到 Netlify 完整教程

> 本文档记录了将 VitePress 项目从本地开发到 GitHub 托管，最终部署到 Netlify 的完整流程。

## 目录

- [环境准备](#环境准备)
- [项目初始化](#项目初始化)
- [GitHub 仓库配置](#github-仓库配置)
- [Netlify 部署配置](#netlify-部署配置)
- [GitLab 备份同步](#gitlab-备份同步)
- [常见问题](#常见问题)

---

## 环境准备

### 1. 安装 Node.js

访问 [Node.js 官网](https://nodejs.org/) 下载并安装 LTS 版本（推荐 18.x 或更高版本）。

验证安装：

```bash
node -v
npm -v
```

### 2. 安装 Git

访问 [Git 官网](https://git-scm.com/) 下载并安装。

验证安装：

```bash
git --version
```

### 3. 注册账号

| 平台 | 用途 | 注册地址 |
|------|------|----------|
| GitHub | 代码托管 | https://github.com |
| Netlify | 网站部署 | https://netlify.com |
| GitLab（可选）| 代码备份 | https://jihulab.com（极狐 GitLab 国内版）|

---

## 项目初始化

### 1. 创建 VitePress 项目

```bash
# 创建项目目录
mkdir tech-blog
cd tech-blog

# 初始化 npm
npm init -y

# 安装 VitePress
npm install -D vitepress
```

### 2. 创建项目结构

```
tech-blog/
├── docs/
│   ├── .vitepress/
│   │   └── config.ts    # VitePress 配置文件
│   ├── index.md         # 首页
│   └── guide/           # 文章目录
│       └── index.md
├── package.json
└── netlify.toml
```

### 3. 配置 package.json

```json
{
  "name": "tech-blog",
  "version": "1.0.0",
  "scripts": {
    "dev": "vitepress dev docs",
    "build": "vitepress build docs",
    "preview": "vitepress preview docs"
  },
  "dependencies": {
    "vitepress": "^1.6.4",
    "vue": "^3.5.30"
  }
}
```

### 4. 创建 Netlify 配置文件

在项目根目录创建 `netlify.toml`：

```toml
[build]
  command = "npm install && npm run build"
  publish = "docs/.vitepress/dist"
```

### 5. 本地测试

```bash
# 启动开发服务器
npm run dev

# 构建测试
npm run build

# 预览构建结果
npm run preview
```

### 6. 创建 .gitignore

在项目根目录创建 `.gitignore`：

```
node_modules/
docs/.vitepress/dist/
docs/.vitepress/cache/
.DS_Store
*.log
```

---

## GitHub 仓库配置

### 1. 创建 GitHub 仓库

1. 登录 GitHub
2. 点击右上角 **+** → **New repository**
3. 填写信息：
   - Repository name: `tech-blog`
   - Description: 个人技术博客
   - 选择 **Public** 或 **Private**
   - **不要**勾选 "Initialize this repository with a README"
4. 点击 **Create repository**

### 2. 配置 Git 用户信息

```bash
git config --global user.name "你的用户名"
git config --global user.email "你的邮箱"
```

### 3. 初始化本地仓库并推送

```bash
# 初始化 Git
git init

# 添加所有文件
git add .

# 首次提交
git commit -m "feat: 初始化 VitePress 博客项目"

# 添加远程仓库（替换为你的仓库地址）
git remote add origin https://github.com/yangshuyin98/tech-blog.git

# 推送到 GitHub
git push -u origin main
```

### 4. SSH Key 配置（可选，推荐）

使用 SSH 方式可以避免每次输入密码：

```bash
# 生成 SSH Key
ssh-keygen -t ed25519 -C "你的邮箱"

# 查看公钥
cat ~/.ssh/id_ed25519.pub
```

将公钥添加到 GitHub：
1. GitHub → Settings → SSH and GPG keys
2. 点击 **New SSH key**
3. 粘贴公钥内容

修改远程仓库地址为 SSH 格式：

```bash
git remote set-url origin git@github.com:yangshuyin98/tech-blog.git
```

---

## Netlify 部署配置

### 1. 登录 Netlify

访问 [app.netlify.com](https://app.netlify.com) 使用 GitHub 账号登录。

### 2. 创建新站点

1. 点击 **Add new site** → **Import an existing project**
2. 选择 **GitHub**
3. 授权 Netlify 访问 GitHub 仓库
4. 选择 `tech-blog` 仓库

### 3. 配置构建设置

Netlify 会自动检测 `netlify.toml` 配置文件，如果没有自动识别，手动填写：

| 设置项 | 值 |
|--------|-----|
| Branch to deploy | `main` |
| Build command | `npm install && npm run build` |
| Publish directory | `docs/.vitepress/dist` |

### 4. 部署

点击 **Deploy site**，等待构建完成（通常 1-3 分钟）。

### 5. 配置自定义域名（可选）

1. 进入站点设置 → **Domain management**
2. 点击 **Add custom domain**
3. 输入你的域名
4. 按照提示配置 DNS 记录

### 6. 开启 HTTPS

Netlify 自动提供 SSL 证书：
1. 进入站点设置 → **HTTPS**
2. 点击 **Verify DNS configuration**
3. 点击 **Provision certificate**

---

## GitLab 备份同步

> 极狐 GitLab (jihulab.com) 是 GitLab 中国版，国内访问速度快，适合作为代码备份。

### 1. 创建极狐 GitLab 仓库

1. 访问 [jihulab.com](https://jihulab.com) 注册账号
2. 创建新项目：
   - 项目名称：`tech-blog`
   - 选择 **Public** 或 **Private**
   - **不要**勾选 "使用自述文件初始化仓库"

### 2. 添加 GitLab 远程仓库

```bash
# 添加 GitLab remote
git remote add gitlab https://jihulab.com/yangshuyin/tech-blog.git

# 推送代码
git push gitlab main
```

### 3. 设置自动同步（可选）

在 GitHub 仓库的 Settings → Webhooks 中添加 Webhook，当代码推送到 GitHub 时自动同步到 GitLab。

### 4. 后续同步

每次更新代码后，推送到两个平台：

```bash
# 推送到 GitHub（触发 Netlify 自动部署）
git push origin main

# 推送到 GitLab（备份）
git push gitlab main
```

---

## 日常开发流程

### 1. 创建新文章

```bash
# 在 docs 目录下创建 Markdown 文件
docs/guide/new-article.md
```

### 2. 本地预览

```bash
npm run dev
```

访问 http://localhost:5173 查看效果。

### 3. 提交并推送

```bash
git add .
git commit -m "feat: 添加新文章 - 文章标题"
git push origin main
```

### 4. 自动部署

推送到 GitHub 后，Netlify 会自动触发构建和部署（通常 1-3 分钟）。

可以在 Netlify 的 **Deploys** 页面查看部署状态。

---

## 常见问题

### Q1: Netlify 构建失败怎么办？

1. 查看 Netlify 的构建日志
2. 常见原因：
   - `package.json` 中缺少依赖
   - `netlify.toml` 配置错误
   - Node.js 版本不兼容

解决方案：在 `netlify.toml` 中指定 Node.js 版本：

```toml
[build]
  command = "npm install && npm run build"
  publish = "docs/.vitepress/dist"

[build.environment]
  NODE_VERSION = "18"
```

### Q2: 如何回滚到之前的版本？

```bash
# 查看提交历史
git log --oneline

# 回滚到指定提交
git revert <commit-hash>

# 推送回滚
git push origin main
```

Netlify 也可以在 Deploys 页面点击之前的版本进行回滚。

### Q3: 如何配置自定义域名？

1. 购买域名（如阿里云、腾讯云）
2. 在域名服务商处添加 CNAME 记录，指向 Netlify 提供的域名
3. 在 Netlify 的 Domain management 中添加自定义域名
4. 等待 DNS 生效（通常 10 分钟 - 24 小时）
5. 开启 HTTPS

### Q4: GitHub 访问慢怎么办？

1. 使用 GitLab（极狐 GitLab）作为主要代码仓库
2. 使用 Webhook 或 GitHub Actions 同步到 GitHub 触发 Netlify 部署
3. 或者直接使用 Vercel 部署（支持 GitLab）

### Q5: 如何添加评论系统？

推荐使用 Giscus（基于 GitHub Discussions）：

1. 访问 [giscus.app](https://giscus.app) 配置
2. 在 VitePress 主题配置中添加 Giscus 组件

---

## 相关资源

- [VitePress 官方文档](https://vitepress.dev/)
- [Netlify 官方文档](https://docs.netlify.com/)
- [GitHub 官方文档](https://docs.github.com/)
- [极狐 GitLab](https://jihulab.com)

---

## 项目信息

- **项目名称**: tech-blog
- **技术栈**: VitePress + Vue 3
- **GitHub**: https://github.com/yangshuyin98/tech-blog
- **GitLab**: https://jihulab.com/yangshuyin/tech-blog
- **部署平台**: Netlify

---

*最后更新: 2026-05-04*
