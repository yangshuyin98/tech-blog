# 技术博客

基于 [VitePress](https://vitepress.dev) 搭建的个人技术博客。

## 本地开发

```bash
npm install
npm run dev        # 启动开发服务器
npm run build      # 构建静态文件
npm run preview    # 预览构建结果
```

## 添加文章

只需两步：

1. 在 `docs/posts/` 目录下新建 `.md` 文件
2. 在文件头部写 front matter：

```markdown
---
title: '文章标题'
category: springboot  # springboot | frontend | backend | linux | database | devops | arch
tags: ['标签1', '标签2']
date: 2026-03-25
readTime: '10 min'
---

正文内容...
```

3. 在 `docs/posts/index.md` 中添加文章链接

**不需要改任何配置文件。** 写完 push 到 GitHub，Netlify 自动构建部署。

## 分类说明

| category 值 | 显示名称 |
|-------------|---------|
| springboot  | Spring Boot |
| frontend    | 前端 |
| backend     | 后端 |
| linux       | Linux |
| database    | 数据库 |
| devops      | DevOps |
| arch        | 架构 |

## 部署

推送到 GitHub 后，Netlify 自动触发构建：
- Build command: 留空
- Publish directory: `docs/.vitepress/dist`
