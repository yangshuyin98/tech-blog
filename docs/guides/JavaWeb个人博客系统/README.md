# JavaWeb 个人博客系统 - 分阶段实施指南

> 技术栈：Java + Servlet + JSP + JDBC + MySQL + HTML/CSS/JS
> 架构：Web 三层架构（Controller → Service → Dao）
> 目标受众：JavaWeb 初学者

## 阶段总览

| 阶段 | 内容 | 指南文件 |
|------|------|----------|
| 阶段1 | 项目创建与环境搭建 | [phase1-project-setup.md](phase1-project-setup.md) |
| 阶段2 | 数据库设计 | [phase2-database-design.md](phase2-database-design.md) |
| 阶段3 | 实体类创建 | [phase3-entity-classes.md](phase3-entity-classes.md) |
| 阶段4 | 数据库工具类封装 | [phase4-db-utility.md](phase4-db-utility.md) |
| 阶段5 | 用户登录 - Dao 层 | [phase5-login-dao.md](phase5-login-dao.md) |
| 阶段6 | 用户登录 - Service 层 | [phase6-login-service.md](phase6-login-service.md) |
| 阶段7 | 用户登录 - Servlet 控制层 | [phase7-login-servlet.md](phase7-login-servlet.md) |
| 阶段8 | 前端登录页面 | [phase8-login-page.md](phase8-login-page.md) |
| 阶段9 | 登录功能集成与测试 | [phase9-login-integration.md](phase9-login-integration.md) |
| 阶段10 | MD5 密码加密 | [phase10-md5-encryption.md](phase10-md5-encryption.md) |
| 阶段11 | 验证码功能 | [phase11-captcha.md](phase11-captcha.md) |
| 阶段12 | 代码重构与配置优化 | [phase12-refactoring.md](phase12-refactoring.md) |
| 阶段13 | 文章模块 - Dao 与 Service 层 | [phase13-article-dao-service.md](phase13-article-dao-service.md) |
| 阶段14 | 博客首页展示 | [phase14-blog-homepage.md](phase14-blog-homepage.md) |
| 阶段15 | 分类、标签与时间轴 | [phase15-category-tag-timeline.md](phase15-category-tag-timeline.md) |
| 阶段16 | 文章详情与评论 | [phase16-article-detail-comments.md](phase16-article-detail-comments.md) |

## 架构总览

```
┌─────────────────────────────────────────────────────┐
│                    浏览器 (Browser)                   │
│              HTML / JSP / CSS / JavaScript           │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP 请求
                       ▼
┌─────────────────────────────────────────────────────┐
│               控制层 (Controller / Servlet)           │
│         LoginServlet / IndexServlet / ...            │
│         接收请求 → 调用 Service → 转发响应            │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│               业务逻辑层 (Service)                    │
│         UserService / ArticleService / ...           │
│         业务规则 → 调用 Dao → 返回结果                │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│               数据访问层 (Dao)                        │
│         UserDao / ArticleDao / ...                   │
│         SQL 操作 → JDBC → 数据库                     │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│               数据库 (MySQL)                         │
│         user 表 / article 表 / comment 表            │
└─────────────────────────────────────────────────────┘
```

## 包结构

```
blog/
├── src/
│   └── com/blog/
│       ├── entity/          # 实体类
│       │   ├── User.java
│       │   ├── Article.java
│       │   └── Comment.java
│       ├── dao/             # 数据访问层
│       │   ├── UserDao.java
│       │   └── ArticleDao.java
│       ├── service/         # 业务逻辑层
│       │   ├── UserService.java
│       │   └── ArticleService.java
│       ├── servlet/         # 控制层
│       │   ├── LoginServlet.java
│       │   └── IndexServlet.java
│       └── util/            # 工具类
│           ├── DBUtil.java
│           └── MD5Util.java
├── web/
│   ├── WEB-INF/
│   │   └── web.xml
│   ├── login.jsp
│   ├── main.jsp
│   └── index.jsp
└── db.properties            # 数据库配置文件
```

## 开发环境要求

| 工具 | 版本要求 |
|------|----------|
| JDK | 1.8+ |
| IDE | IntelliJ IDEA / Eclipse |
| Tomcat | 9.0+ |
| MySQL | 5.7+ / 8.0+ |
| 浏览器 | Chrome / Firefox |
