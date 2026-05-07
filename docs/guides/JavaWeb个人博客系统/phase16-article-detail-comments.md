# 阶段16：文章详情与评论

## 目标
实现文章详情页，支持查看文章全文、上一篇/下一篇导航、阅读次数递增、评论功能。

## 前置条件
- 阶段15分类/标签/时间轴功能完成

## 操作步骤

### 16.1 创建 CommentDao 接口及实现类

文件：`src/com/blog/dao/CommentDao.java`

```java
package com.blog.dao;

import com.blog.entity.Comment;
import java.util.List;

public interface CommentDao {
    /** 根据文章ID查询评论 */
    List<Comment> findByArticleId(Integer articleId);

    /** 添加评论 */
    void add(Comment comment);

    /** 查询文章的评论数量 */
    int countByArticleId(Integer articleId);
}
```

文件：`src/com/blog/dao/impl/CommentDaoImpl.java`

```java
package com.blog.dao.impl;

import com.blog.dao.CommentDao;
import com.blog.entity.Comment;
import com.blog.util.DBUtil;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class CommentDaoImpl implements CommentDao {

    @Override
    public List<Comment> findByArticleId(Integer articleId) {
        String sql = "SELECT * FROM comment WHERE article_id = ? ORDER BY create_time DESC";
        try {
            List<Map<String, Object>> rows = DBUtil.queryList(sql, articleId);
            List<Comment> list = new ArrayList<>();
            for (Map<String, Object> row : rows) {
                Comment c = new Comment();
                c.setId((Integer) row.get("id"));
                c.setArticleId((Integer) row.get("article_id"));
                c.setNickname((String) row.get("nickname"));
                c.setContent((String) row.get("content"));
                c.setCreateTime((java.util.Date) row.get("create_time"));
                list.add(c);
            }
            return list;
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    @Override
    public void add(Comment comment) {
        String sql = "INSERT INTO comment (article_id, nickname, content) VALUES (?, ?, ?)";
        try {
            DBUtil.executeUpdate(sql, comment.getArticleId(), comment.getNickname(), comment.getContent());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public int countByArticleId(Integer articleId) {
        String sql = "SELECT COUNT(*) FROM comment WHERE article_id = ?";
        try {
            Integer result = DBUtil.queryInt(sql, articleId);
            return result != null ? result : 0;
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }
}
```

### 16.2 创建 CommentService 接口及实现类

文件：`src/com/blog/service/CommentService.java`

```java
package com.blog.service;

import com.blog.entity.Comment;
import java.util.List;

public interface CommentService {
    List<Comment> getCommentsByArticleId(Integer articleId);
    void addComment(Comment comment);
    int getCommentCount(Integer articleId);
}
```

文件：`src/com/blog/service/impl/CommentServiceImpl.java`

```java
package com.blog.service.impl;

import com.blog.dao.CommentDao;
import com.blog.dao.impl.CommentDaoImpl;
import com.blog.entity.Comment;
import com.blog.service.CommentService;

import java.util.List;

public class CommentServiceImpl implements CommentService {

    private CommentDao commentDao = new CommentDaoImpl();

    @Override
    public List<Comment> getCommentsByArticleId(Integer articleId) {
        return commentDao.findByArticleId(articleId);
    }

    @Override
    public void addComment(Comment comment) {
        commentDao.add(comment);
    }

    @Override
    public int getCommentCount(Integer articleId) {
        return commentDao.countByArticleId(articleId);
    }
}
```

### 16.3 创建文章详情 Servlet

文件：`src/com/blog/servlet/ArticleServlet.java`

```java
package com.blog.servlet;

import com.blog.entity.Article;
import com.blog.entity.Comment;
import com.blog.service.ArticleService;
import com.blog.service.CommentService;
import com.blog.service.impl.ArticleServiceImpl;
import com.blog.service.impl.CommentServiceImpl;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@WebServlet("/article.do")
public class ArticleServlet extends HttpServlet {

    private ArticleService articleService = new ArticleServiceImpl();
    private CommentService commentService = new CommentServiceImpl();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String idStr = req.getParameter("id");
        if (idStr == null) {
            resp.sendRedirect("index.do");
            return;
        }

        int articleId = Integer.parseInt(idStr);

        // 增加阅读次数
        articleService.addViewCount(articleId);

        // 查询文章详情
        Article article = articleService.getArticleById(articleId);
        req.setAttribute("article", article);

        // 查询上一篇和下一篇
        List<Article> allArticles = articleService.getAllArticles();
        for (int i = 0; i < allArticles.size(); i++) {
            if (allArticles.get(i).getId() == articleId) {
                if (i > 0) {
                    req.setAttribute("prevArticle", allArticles.get(i - 1));
                }
                if (i < allArticles.size() - 1) {
                    req.setAttribute("nextArticle", allArticles.get(i + 1));
                }
                break;
            }
        }

        // 查询评论
        List<Comment> comments = commentService.getCommentsByArticleId(articleId);
        req.setAttribute("comments", comments);

        req.getRequestDispatcher("article.jsp").forward(req, resp);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        req.setCharacterEncoding("UTF-8");

        // 提交评论
        String articleIdStr = req.getParameter("articleId");
        String nickname = req.getParameter("nickname");
        String content = req.getParameter("content");

        if (articleIdStr != null && nickname != null && content != null
                && !nickname.trim().isEmpty() && !content.trim().isEmpty()) {
            Comment comment = new Comment();
            comment.setArticleId(Integer.parseInt(articleIdStr));
            comment.setNickname(nickname.trim());
            comment.setContent(content.trim());
            commentService.addComment(comment);
        }

        // 重定向回文章详情页（防止重复提交）
        resp.sendRedirect("article.do?id=" + articleIdStr);
    }
}
```

### 16.4 创建文章详情页面

文件：`web/article.jsp`

```jsp
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="com.blog.entity.Article, com.blog.entity.Comment, java.util.List, java.text.SimpleDateFormat" %>
<%
    Article article = (Article) request.getAttribute("article");
    Article prevArticle = (Article) request.getAttribute("prevArticle");
    Article nextArticle = (Article) request.getAttribute("nextArticle");
    List<Comment> comments = (List<Comment>) request.getAttribute("comments");
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
%>
<html>
<head>
    <title><%= article != null ? article.getTitle() : "文章详情" %> - 我的博客</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: "Microsoft YaHei", sans-serif; background: #f5f5f5; color: #333; }
        a { text-decoration: none; color: #333; }
        a:hover { color: #667eea; }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #fff; padding: 20px 40px;
            display: flex; justify-content: space-between; align-items: center;
        }
        .nav a { color: #fff; margin-left: 20px; }
        .container { max-width: 900px; margin: 20px auto; padding: 0 20px; }
        .article-detail {
            background: #fff;
            border-radius: 8px;
            padding: 40px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            margin-bottom: 20px;
        }
        .article-detail h1 { font-size: 28px; margin-bottom: 15px; }
        .article-meta { color: #999; font-size: 14px; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 1px solid #eee; }
        .article-meta span { margin-right: 20px; }
        .article-content { line-height: 2; font-size: 16px; }
        .article-content p { margin-bottom: 15px; }

        /* 上下篇导航 */
        .article-nav {
            display: flex; justify-content: space-between;
            background: #fff; border-radius: 8px; padding: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            margin-bottom: 20px;
        }
        .article-nav a { color: #667eea; }

        /* 评论区 */
        .comment-section {
            background: #fff; border-radius: 8px; padding: 30px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        .comment-section h3 { margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #667eea; }
        .comment-item {
            padding: 15px 0;
            border-bottom: 1px dashed #eee;
        }
        .comment-item:last-child { border-bottom: none; }
        .comment-header { display: flex; justify-content: space-between; margin-bottom: 8px; }
        .comment-nick { font-weight: bold; color: #667eea; }
        .comment-time { color: #999; font-size: 13px; }
        .comment-content { color: #555; font-size: 14px; line-height: 1.8; }

        /* 评论表单 */
        .comment-form { margin-top: 25px; }
        .comment-form input, .comment-form textarea {
            width: 100%; padding: 10px 15px;
            border: 1px solid #ddd; border-radius: 5px;
            font-size: 14px; margin-bottom: 10px;
            font-family: "Microsoft YaHei", sans-serif;
        }
        .comment-form textarea { height: 100px; resize: vertical; }
        .comment-form input:focus, .comment-form textarea:focus { outline: none; border-color: #667eea; }
        .btn-submit {
            padding: 10px 30px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none; border-radius: 5px;
            color: #fff; font-size: 14px; cursor: pointer;
        }
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

    <% if (article != null) { %>
    <div class="container">
        <!-- 文章详情 -->
        <div class="article-detail">
            <h1><%= article.getTitle() %></h1>
            <div class="article-meta">
                <span>分类：<%= article.getCategoryName() != null ? article.getCategoryName() : "未分类" %></span>
                <span>阅读：<%= article.getViewCount() %></span>
                <span>标签：<%= article.getTags() != null ? article.getTags() : "" %></span>
            </div>
            <div class="article-content">
                <%= article.getContent() != null ? article.getContent().replace("\n", "<br>") : "" %>
            </div>
        </div>

        <!-- 上一篇 / 下一篇 -->
        <div class="article-nav">
            <% if (prevArticle != null) { %>
                <a href="article.do?id=<%= prevArticle.getId() %>">← 上一篇：<%= prevArticle.getTitle() %></a>
            <% } else { %>
                <span>已经是第一篇了</span>
            <% } %>
            <% if (nextArticle != null) { %>
                <a href="article.do?id=<%= nextArticle.getId() %>">下一篇：<%= nextArticle.getTitle() %> →</a>
            <% } else { %>
                <span>已经是最后一篇了</span>
            <% } %>
        </div>

        <!-- 评论区 -->
        <div class="comment-section">
            <h3>评论（<%= comments != null ? comments.size() : 0 %>）</h3>

            <!-- 评论列表 -->
            <% if (comments != null) {
                for (Comment c : comments) { %>
                <div class="comment-item">
                    <div class="comment-header">
                        <span class="comment-nick"><%= c.getNickname() %></span>
                        <span class="comment-time"><%= c.getCreateTime() != null ? sdf.format(c.getCreateTime()) : "" %></span>
                    </div>
                    <div class="comment-content"><%= c.getContent() %></div>
                </div>
            <% } } %>

            <!-- 评论表单 -->
            <div class="comment-form">
                <form action="article.do" method="post">
                    <input type="hidden" name="articleId" value="<%= article.getId() %>">
                    <input type="text" name="nickname" placeholder="你的昵称" required>
                    <textarea name="content" placeholder="写下你的评论..." required></textarea>
                    <button type="submit" class="btn-submit">发表评论</button>
                </form>
            </div>
        </div>
    </div>
    <% } else { %>
    <div class="container">
        <p style="text-align:center; padding:50px;">文章不存在</p>
    </div>
    <% } %>
</body>
</html>
```

## 知识点

### POST 提交评论 + PRG 模式

```
PRG（Post-Redirect-Get）模式：

1. 用户填写评论 → POST 提交到 ArticleServlet
2. Servlet 处理完 → 重定向（redirect）到文章详情页
3. 浏览器发起 GET 请求 → 显示文章和评论

好处：刷新页面不会重复提交评论
```

```
不用 PRG（有问题）：
POST → 显示页面 → 刷新 → 又提交一次 → 又提交一次...

用 PRG（正确）：
POST → 302重定向 → GET → 显示页面 → 刷新 → 只是重新GET，不重复提交
```

### 文章内容换行处理

```java
article.getContent().replace("\n", "<br>")
```

数据库中存储的换行符是 `\n`，但 HTML 需要 `<br>` 才能换行显示。

### 上一篇/下一篇的实现思路

```
所有文章按时间倒序排列：
[文章5, 文章4, 文章3, 文章2, 文章1]
                ↑ 当前文章（index=2）
上一篇 = index-1 = 文章4
下一篇 = index+1 = 文章2
```

## 检查清单

- [ ] `CommentDao.java` 和 `CommentDaoImpl.java` 创建成功
- [ ] `CommentService.java` 和 `CommentServiceImpl.java` 创建成功
- [ ] `ArticleServlet.java` 创建成功（支持 GET 查看和 POST 评论）
- [ ] `article.jsp` 创建成功
- [ ] 文章详情能正常显示（标题、内容、分类、标签、阅读量）
- [ ] 阅读次数每次访问自动 +1
- [ ] 上一篇/下一篇导航正常工作
- [ ] 评论列表正常显示
- [ ] 提交评论后页面刷新，评论出现在列表中
- [ ] 刷新页面不会重复提交评论（PRG 模式）
- [ ] 所有页面链接互通，无死链

---

恭喜！到这里博客系统的核心功能已经全部完成。
