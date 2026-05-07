# 阶段13：文章模块 - Dao 与 Service 层

## 目标
创建文章相关的 Dao 和 Service 层代码，支持文章的增删改查、按分类查询、按标签查询、按时间轴查询等。

## 前置条件
- 阶段2数据库表创建完成
- 阶段4数据库工具类可用

## 操作步骤

### 13.1 创建 ArticleDao 接口

文件：`src/com/blog/dao/ArticleDao.java`

```java
package com.blog.dao;

import com.blog.entity.Article;
import java.util.List;

public interface ArticleDao {
    /** 查询所有文章（带分类名称） */
    List<Article> findAll();

    /** 根据ID查询文章详情 */
    Article findById(Integer id);

    /** 根据分类ID查询文章 */
    List<Article> findByCategoryId(Integer categoryId);

    /** 根据标签查询文章（模糊匹配） */
    List<Article> findByTag(String tag);

    /** 查询文章总数 */
    int count();

    /** 查询各分类下的文章数量 */
    List<Article> countByCategory();

    /** 查询阅读排行（按阅读量降序） */
    List<Article> findTopByViewCount(int limit);

    /** 根据年月查询文章（时间轴） */
    List<Article> findByYearMonth(String yearMonth);

    /** 查询所有不重复的年月 */
    List<String> findYearMonths();

    /** 查询所有不重复的标签 */
    List<String> findAllTags();

    /** 更新文章阅读次数 */
    void incrementViewCount(Integer id);
}
```

### 13.2 创建 ArticleDao 实现类

文件：`src/com/blog/dao/impl/ArticleDaoImpl.java`

```java
package com.blog.dao.impl;

import com.blog.dao.ArticleDao;
import com.blog.entity.Article;
import com.blog.util.DBUtil;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class ArticleDaoImpl implements ArticleDao {

    /**
     * 将 Map 行数据转换为 Article 对象
     */
    private Article mapToArticle(Map<String, Object> row) {
        Article article = new Article();
        article.setId((Integer) row.get("id"));
        article.setTitle((String) row.get("title"));
        article.setContent((String) row.get("content"));
        article.setSummary((String) row.get("summary"));
        article.setCategoryId((Integer) row.get("category_id"));
        article.setTags((String) row.get("tags"));
        if (row.get("view_count") != null) {
            article.setViewCount(((Number) row.get("view_count")).intValue());
        }
        article.setCreateTime((java.util.Date) row.get("create_time"));
        article.setUpdateTime((java.util.Date) row.get("update_time"));
        if (row.get("category_name") != null) {
            article.setCategoryName((String) row.get("category_name"));
        }
        return article;
    }

    @Override
    public List<Article> findAll() {
        String sql = "SELECT a.*, c.name AS category_name FROM article a " +
                     "LEFT JOIN category c ON a.category_id = c.id " +
                     "ORDER BY a.create_time DESC";
        try {
            List<Map<String, Object>> rows = DBUtil.queryList(sql);
            List<Article> list = new ArrayList<>();
            for (Map<String, Object> row : rows) {
                list.add(mapToArticle(row));
            }
            return list;
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    @Override
    public Article findById(Integer id) {
        String sql = "SELECT a.*, c.name AS category_name FROM article a " +
                     "LEFT JOIN category c ON a.category_id = c.id " +
                     "WHERE a.id = ?";
        try {
            Map<String, Object> row = DBUtil.queryOne(sql, id);
            return row != null ? mapToArticle(row) : null;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public List<Article> findByCategoryId(Integer categoryId) {
        String sql = "SELECT a.*, c.name AS category_name FROM article a " +
                     "LEFT JOIN category c ON a.category_id = c.id " +
                     "WHERE a.category_id = ? ORDER BY a.create_time DESC";
        try {
            List<Map<String, Object>> rows = DBUtil.queryList(sql, categoryId);
            List<Article> list = new ArrayList<>();
            for (Map<String, Object> row : rows) {
                list.add(mapToArticle(row));
            }
            return list;
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    @Override
    public List<Article> findByTag(String tag) {
        String sql = "SELECT a.*, c.name AS category_name FROM article a " +
                     "LEFT JOIN category c ON a.category_id = c.id " +
                     "WHERE a.tags LIKE ? ORDER BY a.create_time DESC";
        try {
            List<Map<String, Object>> rows = DBUtil.queryList(sql, "%" + tag + "%");
            List<Article> list = new ArrayList<>();
            for (Map<String, Object> row : rows) {
                list.add(mapToArticle(row));
            }
            return list;
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    @Override
    public int count() {
        String sql = "SELECT COUNT(*) FROM article";
        try {
            Integer result = DBUtil.queryInt(sql);
            return result != null ? result : 0;
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    @Override
    public List<Article> countByCategory() {
        String sql = "SELECT c.name AS category_name, COUNT(a.id) AS view_count " +
                     "FROM category c LEFT JOIN article a ON c.id = a.category_id " +
                     "GROUP BY c.id, c.name ORDER BY c.sort";
        try {
            List<Map<String, Object>> rows = DBUtil.queryList(sql);
            List<Article> list = new ArrayList<>();
            for (Map<String, Object> row : rows) {
                Article a = new Article();
                a.setCategoryName((String) row.get("category_name"));
                a.setViewCount(((Number) row.get("view_count")).intValue());
                list.add(a);
            }
            return list;
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    @Override
    public List<Article> findTopByViewCount(int limit) {
        String sql = "SELECT a.*, c.name AS category_name FROM article a " +
                     "LEFT JOIN category c ON a.category_id = c.id " +
                     "ORDER BY a.view_count DESC LIMIT ?";
        try {
            List<Map<String, Object>> rows = DBUtil.queryList(sql, limit);
            List<Article> list = new ArrayList<>();
            for (Map<String, Object> row : rows) {
                list.add(mapToArticle(row));
            }
            return list;
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    @Override
    public List<Article> findByYearMonth(String yearMonth) {
        String sql = "SELECT a.*, c.name AS category_name FROM article a " +
                     "LEFT JOIN category c ON a.category_id = c.id " +
                     "WHERE DATE_FORMAT(a.create_time, '%Y-%m') = ? " +
                     "ORDER BY a.create_time DESC";
        try {
            List<Map<String, Object>> rows = DBUtil.queryList(sql, yearMonth);
            List<Article> list = new ArrayList<>();
            for (Map<String, Object> row : rows) {
                list.add(mapToArticle(row));
            }
            return list;
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    @Override
    public List<String> findYearMonths() {
        String sql = "SELECT DISTINCT DATE_FORMAT(create_time, '%Y-%m') AS ym " +
                     "FROM article ORDER BY ym DESC";
        try {
            List<Map<String, Object>> rows = DBUtil.queryList(sql);
            List<String> list = new ArrayList<>();
            for (Map<String, Object> row : rows) {
                list.add((String) row.get("ym"));
            }
            return list;
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    @Override
    public List<String> findAllTags() {
        String sql = "SELECT tags FROM article WHERE tags IS NOT NULL AND tags != ''";
        try {
            List<Map<String, Object>> rows = DBUtil.queryList(sql);
            List<String> tags = new ArrayList<>();
            for (Map<String, Object> row : rows) {
                String tagStr = (String) row.get("tags");
                if (tagStr != null) {
                    String[] tagArr = tagStr.split(",");
                    for (String tag : tagArr) {
                        String t = tag.trim();
                        if (!t.isEmpty() && !tags.contains(t)) {
                            tags.add(t);
                        }
                    }
                }
            }
            return tags;
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    @Override
    public void incrementViewCount(Integer id) {
        String sql = "UPDATE article SET view_count = view_count + 1 WHERE id = ?";
        try {
            DBUtil.executeUpdate(sql, id);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

### 13.3 创建 ArticleService 接口

文件：`src/com/blog/service/ArticleService.java`

```java
package com.blog.service;

import com.blog.entity.Article;
import java.util.List;

public interface ArticleService {
    List<Article> getAllArticles();
    Article getArticleById(Integer id);
    List<Article> getArticlesByCategoryId(Integer categoryId);
    List<Article> getArticlesByTag(String tag);
    int getArticleCount();
    List<Article> getCategoryStats();
    List<Article> getTopArticles(int limit);
    List<Article> getArticlesByYearMonth(String yearMonth);
    List<String> getYearMonths();
    List<String> getAllTags();
    void addViewCount(Integer id);
}
```

### 13.4 创建 ArticleService 实现类

文件：`src/com/blog/service/impl/ArticleServiceImpl.java`

```java
package com.blog.service.impl;

import com.blog.dao.ArticleDao;
import com.blog.dao.impl.ArticleDaoImpl;
import com.blog.entity.Article;
import com.blog.service.ArticleService;

import java.util.List;

public class ArticleServiceImpl implements ArticleService {

    private ArticleDao articleDao = new ArticleDaoImpl();

    @Override
    public List<Article> getAllArticles() {
        return articleDao.findAll();
    }

    @Override
    public Article getArticleById(Integer id) {
        return articleDao.findById(id);
    }

    @Override
    public List<Article> getArticlesByCategoryId(Integer categoryId) {
        return articleDao.findByCategoryId(categoryId);
    }

    @Override
    public List<Article> getArticlesByTag(String tag) {
        return articleDao.findByTag(tag);
    }

    @Override
    public int getArticleCount() {
        return articleDao.count();
    }

    @Override
    public List<Article> getCategoryStats() {
        return articleDao.countByCategory();
    }

    @Override
    public List<Article> getTopArticles(int limit) {
        return articleDao.findTopByViewCount(limit);
    }

    @Override
    public List<Article> getArticlesByYearMonth(String yearMonth) {
        return articleDao.findByYearMonth(yearMonth);
    }

    @Override
    public List<String> getYearMonths() {
        return articleDao.findYearMonths();
    }

    @Override
    public List<String> getAllTags() {
        return articleDao.findAllTags();
    }

    @Override
    public void addViewCount(Integer id) {
        articleDao.incrementViewCount(id);
    }
}
```

## 知识点

### SQL 多表联查（LEFT JOIN）

```
article 表：                    category 表：
id | title     | category_id    id | name
1  | Java入门   | 1              1  | Java
2  | Spring教程 | 2              2  | 框架

联查结果：
a.id | a.title     | c.name
1    | Java入门     | Java
2    | Spring教程   | 框架
```

`LEFT JOIN` 保证即使分类被删除，文章仍然能查出来（`c.name` 显示为 NULL）。

### LIKE 模糊查询

```sql
-- 包含 "Java" 的标签
WHERE tags LIKE '%Java%'
-- % 表示任意字符（0个或多个）
```

### DATE_FORMAT 日期格式化

```sql
-- 将日期格式化为 "2025-08" 格式
DATE_FORMAT(create_time, '%Y-%m')
-- %Y = 四位年份，%m = 两位月份
```

## 检查清单

- [ ] `ArticleDao.java` 接口创建成功，包含所有方法定义
- [ ] `ArticleDaoImpl.java` 实现类创建成功
- [ ] `ArticleService.java` 接口创建成功
- [ ] `ArticleServiceImpl.java` 实现类创建成功
- [ ] `findAll()` 能查到文章列表（带分类名称）
- [ ] `findById()` 能查到单篇文章详情
- [ ] `findByCategoryId()` 能按分类查文章
- [ ] `findByTag()` 能按标签模糊查文章
- [ ] `incrementViewCount()` 能增加阅读次数
- [ ] 无编译错误
