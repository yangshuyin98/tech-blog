# 阶段15：分类、标签与时间轴

## 目标
实现按分类查看文章、按标签查看文章、按时间轴查看文章的功能。

## 前置条件
- 阶段14博客首页完成

## 操作步骤

### 15.1 创建分类查询 Servlet

文件：`src/com/blog/servlet/CategoryServlet.java`

```java
package com.blog.servlet;

import com.blog.entity.Article;
import com.blog.service.ArticleService;
import com.blog.service.impl.ArticleServiceImpl;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@WebServlet("/category.do")
public class CategoryServlet extends HttpServlet {

    private ArticleService articleService = new ArticleServiceImpl();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String idStr = req.getParameter("id");
        if (idStr != null) {
            int categoryId = Integer.parseInt(idStr);
            List<Article> articles = articleService.getArticlesByCategoryId(categoryId);
            req.setAttribute("articles", articles);
            req.setAttribute("title", "分类文章");
        }
        // 复用首页的侧边栏数据
        loadSidebarData(req);
        req.getRequestDispatcher("index.jsp").forward(req, resp);
    }

    private void loadSidebarData(HttpServletRequest req) {
        req.setAttribute("categoryStats", articleService.getCategoryStats());
        req.setAttribute("topArticles", articleService.getTopArticles(5));
        req.setAttribute("tags", articleService.getAllTags());
        req.setAttribute("articleCount", articleService.getArticleCount());
    }
}
```

### 15.2 创建标签查询 Servlet

文件：`src/com/blog/servlet/TagServlet.java`

```java
package com.blog.servlet;

import com.blog.entity.Article;
import com.blog.service.ArticleService;
import com.blog.service.impl.ArticleServiceImpl;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@WebServlet("/tag.do")
public class TagServlet extends HttpServlet {

    private ArticleService articleService = new ArticleServiceImpl();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String tagName = req.getParameter("name");
        if (tagName != null) {
            List<Article> articles = articleService.getArticlesByTag(tagName);
            req.setAttribute("articles", articles);
            req.setAttribute("title", "标签：" + tagName);
        }
        loadSidebarData(req);
        req.getRequestDispatcher("index.jsp").forward(req, resp);
    }

    private void loadSidebarData(HttpServletRequest req) {
        req.setAttribute("categoryStats", articleService.getCategoryStats());
        req.setAttribute("topArticles", articleService.getTopArticles(5));
        req.setAttribute("tags", articleService.getAllTags());
        req.setAttribute("articleCount", articleService.getArticleCount());
    }
}
```

### 15.3 创建时间轴查询 Servlet

文件：`src/com/blog/servlet/TimelineServlet.java`

```java
package com.blog.servlet;

import com.blog.entity.Article;
import com.blog.service.ArticleService;
import com.blog.service.impl.ArticleServiceImpl;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@WebServlet("/timeline.do")
public class TimelineServlet extends HttpServlet {

    private ArticleService articleService = new ArticleServiceImpl();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        // 加载时间轴数据
        List<String> yearMonths = articleService.getYearMonths();
        req.setAttribute("yearMonths", yearMonths);

        String ym = req.getParameter("ym");
        if (ym != null) {
            List<Article> articles = articleService.getArticlesByYearMonth(ym);
            req.setAttribute("articles", articles);
            req.setAttribute("title", "时间轴：" + ym);
        } else {
            // 默认显示所有文章
            req.setAttribute("articles", articleService.getAllArticles());
        }

        loadSidebarData(req);
        req.getRequestDispatcher("timeline.jsp").forward(req, resp);
    }

    private void loadSidebarData(HttpServletRequest req) {
        req.setAttribute("categoryStats", articleService.getCategoryStats());
        req.setAttribute("topArticles", articleService.getTopArticles(5));
        req.setAttribute("tags", articleService.getAllTags());
        req.setAttribute("articleCount", articleService.getArticleCount());
    }
}
```

### 15.4 创建时间轴页面

文件：`web/timeline.jsp`

```jsp
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="com.blog.entity.Article, java.util.List" %>
<%
    List<String> yearMonths = (List<String>) request.getAttribute("yearMonths");
    List<Article> articles = (List<Article>) request.getAttribute("articles");
%>
<html>
<head>
    <title>时间轴 - 我的博客</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: "Microsoft YaHei", sans-serif; background: #f5f5f5; }
        a { text-decoration: none; color: #333; }
        a:hover { color: #667eea; }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #fff; padding: 20px 40px;
            display: flex; justify-content: space-between; align-items: center;
        }
        .nav a { color: #fff; margin-left: 20px; }
        .container { max-width: 900px; margin: 20px auto; padding: 0 20px; }
        .timeline-nav { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 30px; }
        .timeline-nav a {
            padding: 6px 16px;
            background: #fff;
            border-radius: 20px;
            font-size: 14px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .timeline-nav a.active { background: #667eea; color: #fff; }
        .timeline {
            position: relative;
            padding-left: 30px;
        }
        .timeline::before {
            content: '';
            position: absolute;
            left: 10px;
            top: 0;
            bottom: 0;
            width: 2px;
            background: #667eea;
        }
        .timeline-item {
            position: relative;
            margin-bottom: 20px;
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        .timeline-item::before {
            content: '';
            position: absolute;
            left: -25px;
            top: 25px;
            width: 12px;
            height: 12px;
            background: #667eea;
            border-radius: 50%;
        }
        .timeline-item h3 { margin-bottom: 8px; }
        .timeline-item .meta { color: #999; font-size: 13px; }
    </style>
</head>
<body>
    <div class="header">
        <h2>我的博客</h2>
        <div>
            <a href="index.do" class="nav">首页</a>
            <a href="timeline.do" class="nav">时间轴</a>
        </div>
    </div>
    <div class="container">
        <h2 style="margin-bottom: 20px;">时间轴</h2>
        <div class="timeline-nav">
            <a href="timeline.do" class="<%= request.getParameter("ym") == null ? "active" : "" %>">全部</a>
            <% if (yearMonths != null) {
                for (String ym : yearMonths) { %>
                <a href="timeline.do?ym=<%= ym %>"
                   class="<%= ym.equals(request.getParameter("ym")) ? "active" : "" %>">
                    <%= ym %>
                </a>
            <% } } %>
        </div>
        <div class="timeline">
            <% if (articles != null) {
                for (Article article : articles) { %>
                <div class="timeline-item">
                    <h3><a href="article.do?id=<%= article.getId() %>"><%= article.getTitle() %></a></h3>
                    <div class="meta">
                        分类：<%= article.getCategoryName() != null ? article.getCategoryName() : "未分类" %>
                        | 阅读：<%= article.getViewCount() %>
                        | 标签：<%= article.getTags() != null ? article.getTags() : "" %>
                    </div>
                </div>
            <% } } %>
        </div>
    </div>
</body>
</html>
```

## 知识点

### URL 参数传递

```
分类查询：/category.do?id=1     → categoryId = 1
标签查询：/tag.do?name=Java     → tagName = "Java"
时间轴：  /timeline.do?ym=2025-08 → yearMonth = "2025-08"
```

浏览器地址栏的 `?key=value` 格式就是 URL 参数，Servlet 通过 `req.getParameter("key")` 获取。

### 代码复用

三个 Servlet 都需要加载侧边栏数据，所以抽取了 `loadSidebarData()` 方法：

```
CategoryServlet ──┐
TagServlet        ├── 都调用 loadSidebarData()
TimelineServlet ──┘
```

## 检查清单

- [ ] `CategoryServlet.java` 创建成功
- [ ] `TagServlet.java` 创建成功
- [ ] `TimelineServlet.java` 创建成功
- [ ] `timeline.jsp` 创建成功
- [ ] 首页点击分类能跳转并显示该分类下的文章
- [ ] 首页点击标签能跳转并显示包含该标签的文章
- [ ] 时间轴页面能按年月筛选文章
- [ ] 时间轴导航高亮当前选中的年月
- [ ] 所有页面侧边栏数据正常显示
