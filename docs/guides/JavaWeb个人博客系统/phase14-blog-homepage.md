# 阶段14：博客首页展示

## 目标
创建博客首页，展示文章列表、文章摘要、分类统计、阅读排行、标签云等模块。

## 前置条件
- 阶段13 ArticleDao 和 ArticleService 创建完成
- 阶段9登录功能可用

## 操作步骤

### 14.1 创建首页 Servlet（IndexServlet）

文件：`src/com/blog/servlet/IndexServlet.java`

```java
package com.blog.servlet;

import com.blog.entity.Article;
import com.blog.service.ArticleService;
import com.blog.service.UserService;
import com.blog.service.impl.ArticleServiceImpl;
import com.blog.service.impl.UserServiceImpl;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@WebServlet("/index.do")
public class IndexServlet extends HttpServlet {

    private ArticleService articleService = new ArticleServiceImpl();
    private UserService userService = new UserServiceImpl();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        // 加载文章列表
        List<Article> articles = articleService.getAllArticles();
        req.setAttribute("articles", articles);

        // 加载分类统计
        List<Article> categoryStats = articleService.getCategoryStats();
        req.setAttribute("categoryStats", categoryStats);

        // 加载阅读排行（前5篇）
        List<Article> topArticles = articleService.getTopArticles(5);
        req.setAttribute("topArticles", topArticles);

        // 加载标签云
        List<String> tags = articleService.getAllTags();
        req.setAttribute("tags", tags);

        // 加载博主信息
        req.setAttribute("blogger", userService.getBlogger());

        // 文章总数
        req.setAttribute("articleCount", articleService.getArticleCount());

        // 转发到首页 JSP
        req.getRequestDispatcher("index.jsp").forward(req, resp);
    }
}
```

### 14.2 更新 UserService 增加获取博主信息方法

在 `UserService` 接口中添加：

```java
/** 获取博主信息 */
User getBlogger();
```

在 `UserServiceImpl` 中添加：

```java
@Override
public User getBlogger() {
    // 查询第一个用户作为博主
    UserDao userDao = new UserDaoImpl();
    String sql = "SELECT * FROM user LIMIT 1";
    try {
        Map<String, Object> row = DBUtil.queryOne(sql);
        if (row != null) {
            User user = new User();
            user.setId((Integer) row.get("id"));
            user.setUsername((String) row.get("username"));
            user.setNickname((String) row.get("nickname"));
            user.setAvatar((String) row.get("avatar"));
            user.setSignature((String) row.get("signature"));
            return user;
        }
    } catch (Exception e) {
        e.printStackTrace();
    }
    return null;
}
```

### 14.3 创建博客首页 JSP

文件：`web/index.jsp`

```jsp
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="com.blog.entity.Article, com.blog.entity.User, java.util.List" %>
<%
    List<Article> articles = (List<Article>) request.getAttribute("articles");
    List<Article> categoryStats = (List<Article>) request.getAttribute("categoryStats");
    List<Article> topArticles = (List<Article>) request.getAttribute("topArticles");
    List<String> tags = (List<String>) request.getAttribute("tags");
    User blogger = (User) request.getAttribute("blogger");
    Integer articleCount = (Integer) request.getAttribute("articleCount");
%>
<html>
<head>
    <title>我的博客</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: "Microsoft YaHei", sans-serif; background: #f5f5f5; color: #333; }
        a { text-decoration: none; color: #333; }
        a:hover { color: #667eea; }

        /* 头部 */
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #fff;
            padding: 30px 0;
            text-align: center;
        }
        .header h1 { font-size: 32px; margin-bottom: 10px; }
        .header p { font-size: 16px; opacity: 0.8; }

        /* 主体布局 */
        .container {
            max-width: 1200px;
            margin: 20px auto;
            display: flex;
            gap: 20px;
            padding: 0 20px;
        }
        .main-content { flex: 1; }
        .sidebar { width: 300px; }

        /* 文章卡片 */
        .article-card {
            background: #fff;
            border-radius: 8px;
            padding: 25px;
            margin-bottom: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            transition: transform 0.2s;
        }
        .article-card:hover { transform: translateY(-2px); }
        .article-card h3 { margin-bottom: 10px; }
        .article-card h3 a { color: #333; }
        .article-card h3 a:hover { color: #667eea; }
        .article-meta { color: #999; font-size: 13px; margin-bottom: 10px; }
        .article-meta span { margin-right: 15px; }
        .article-summary { color: #666; font-size: 14px; line-height: 1.8; }

        /* 侧边栏模块 */
        .sidebar-box {
            background: #fff;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        .sidebar-box h3 {
            font-size: 16px;
            padding-bottom: 10px;
            border-bottom: 2px solid #667eea;
            margin-bottom: 15px;
        }

        /* 博主信息 */
        .blogger-info { text-align: center; }
        .blogger-avatar {
            width: 80px; height: 80px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea, #764ba2);
            margin: 0 auto 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-size: 32px;
        }
        .blogger-name { font-size: 18px; margin-bottom: 5px; }
        .blogger-signature { color: #999; font-size: 13px; }
        .blogger-stats { margin-top: 15px; display: flex; justify-content: center; gap: 30px; }
        .blogger-stats div { text-align: center; }
        .blogger-stats .num { font-size: 20px; color: #667eea; font-weight: bold; }
        .blogger-stats .label { font-size: 12px; color: #999; }

        /* 分类列表 */
        .category-list { list-style: none; }
        .category-list li {
            padding: 8px 0;
            border-bottom: 1px dashed #eee;
            display: flex;
            justify-content: space-between;
        }
        .category-list li:last-child { border-bottom: none; }
        .category-count {
            background: #667eea;
            color: #fff;
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 12px;
        }

        /* 阅读排行 */
        .rank-list { list-style: none; counter-reset: rank; }
        .rank-list li {
            padding: 8px 0;
            border-bottom: 1px dashed #eee;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .rank-list li:last-child { border-bottom: none; }
        .rank-num {
            width: 20px; height: 20px;
            background: #667eea;
            color: #fff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            flex-shrink: 0;
        }

        /* 标签云 */
        .tag-cloud { display: flex; flex-wrap: wrap; gap: 8px; }
        .tag-item {
            background: #f0f0f0;
            padding: 4px 12px;
            border-radius: 15px;
            font-size: 13px;
            color: #666;
            cursor: pointer;
        }
        .tag-item:hover { background: #667eea; color: #fff; }
    </style>
</head>
<body>
    <div class="header">
        <h1>我的个人博客</h1>
        <p>热爱技术，热爱生活</p>
    </div>

    <div class="container">
        <!-- 左侧文章列表 -->
        <div class="main-content">
            <% if (articles != null) {
                for (Article article : articles) { %>
                <div class="article-card">
                    <h3><a href="article.do?id=<%= article.getId() %>"><%= article.getTitle() %></a></h3>
                    <div class="article-meta">
                        <span>分类：<%= article.getCategoryName() != null ? article.getCategoryName() : "未分类" %></span>
                        <span>阅读：<%= article.getViewCount() %></span>
                        <span>标签：<%= article.getTags() != null ? article.getTags() : "" %></span>
                    </div>
                    <div class="article-summary">
                        <%= article.getSummary() != null ? article.getSummary() : "" %>
                    </div>
                </div>
            <% } } %>
        </div>

        <!-- 右侧边栏 -->
        <div class="sidebar">
            <!-- 博主信息 -->
            <div class="sidebar-box blogger-info">
                <div class="blogger-avatar">
                    <%= blogger != null && blogger.getNickname() != null ? blogger.getNickname().substring(0, 1) : "B" %>
                </div>
                <div class="blogger-name"><%= blogger != null ? blogger.getNickname() : "博主" %></div>
                <div class="blogger-signature"><%= blogger != null && blogger.getSignature() != null ? blogger.getSignature() : "" %></div>
                <div class="blogger-stats">
                    <div>
                        <div class="num"><%= articleCount != null ? articleCount : 0 %></div>
                        <div class="label">文章</div>
                    </div>
                </div>
            </div>

            <!-- 文章分类 -->
            <div class="sidebar-box">
                <h3>文章分类</h3>
                <ul class="category-list">
                    <% if (categoryStats != null) {
                        for (Article stat : categoryStats) { %>
                        <li>
                            <a href="category.do?id=<%= stat.getCategoryId() %>"><%= stat.getCategoryName() %></a>
                            <span class="category-count"><%= stat.getViewCount() %></span>
                        </li>
                    <% } } %>
                </ul>
            </div>

            <!-- 阅读排行 -->
            <div class="sidebar-box">
                <h3>阅读排行</h3>
                <ol class="rank-list">
                    <% if (topArticles != null) {
                        int rank = 1;
                        for (Article top : topArticles) { %>
                        <li>
                            <span class="rank-num"><%= rank++ %></span>
                            <a href="article.do?id=<%= top.getId() %>"><%= top.getTitle() %></a>
                        </li>
                    <% } } %>
                </ol>
            </div>

            <!-- 标签云 -->
            <div class="sidebar-box">
                <h3>标签云</h3>
                <div class="tag-cloud">
                    <% if (tags != null) {
                        for (String tag : tags) { %>
                        <a href="tag.do?name=<%= tag %>" class="tag-item"><%= tag %></a>
                    <% } } %>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
```

## 知识点

### JSP 中的 Java 代码块

```jsp
<%-- 声明变量 --%>
<% List<Article> articles = (List<Article>) request.getAttribute("articles"); %>

<%-- 输出表达式 --%>
<%= article.getTitle() %>

<%-- 循环 --%>
<% for (Article a : articles) { %>
    <p><%= a.getTitle() %></p>
<% } %>
```

### Flex 布局

```css
.container {
    display: flex;      /* 启用 Flex 布局 */
    gap: 20px;          /* 子元素间距 */
}
.main-content { flex: 1; }  /* 占据剩余空间 */
.sidebar { width: 300px; }  /* 固定宽度 */
```

## 检查清单

- [ ] `IndexServlet.java` 创建成功
- [ ] `index.jsp` 创建成功
- [ ] 文章列表能正常显示（标题、摘要、分类、标签、阅读量）
- [ ] 博主信息模块显示正确
- [ ] 文章分类统计显示正确
- [ ] 阅读排行显示正确（前5篇）
- [ ] 标签云显示正确
- [ ] 点击文章标题能跳转到详情页（后续阶段实现）
- [ ] 页面布局美观，无乱码
