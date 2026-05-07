# 阶段3：实体类创建

## 目标
创建与数据库表对应的 Java 实体类（Entity / POJO），用于在各层之间传递数据。

## 前置条件
- 阶段2数据库表创建完成
- 项目包结构已建立

## 操作步骤

### 3.1 创建 User 实体类

文件：`src/com/blog/entity/User.java`

```java
package com.blog.entity;

import java.util.Date;

public class User {
    private Integer id;
    private String username;
    private String password;
    private String nickname;
    private String avatar;
    private String email;
    private String signature;
    private Date createTime;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSignature() {
        return signature;
    }

    public void setSignature(String signature) {
        this.signature = signature;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }
}
```

### 3.2 创建 Article 实体类

文件：`src/com/blog/entity/Article.java`

```java
package com.blog.entity;

import java.util.Date;

public class Article {
    private Integer id;
    private String title;
    private String content;
    private String summary;
    private Integer categoryId;
    private String tags;
    private Integer viewCount;
    private Date createTime;
    private Date updateTime;

    // 关联字段（非数据库表字段，用于展示）
    private String categoryName;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public Integer getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Integer categoryId) {
        this.categoryId = categoryId;
    }

    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }

    public Integer getViewCount() {
        return viewCount;
    }

    public void setViewCount(Integer viewCount) {
        this.viewCount = viewCount;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public Date getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }
}
```

### 3.3 创建 Category 实体类

文件：`src/com/blog/entity/Category.java`

```java
package com.blog.entity;

public class Category {
    private Integer id;
    private String name;
    private Integer sort;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getSort() {
        return sort;
    }

    public void setSort(Integer sort) {
        this.sort = sort;
    }
}
```

### 3.4 创建 Comment 实体类

文件：`src/com/blog/entity/Comment.java`

```java
package com.blog.entity;

import java.util.Date;

public class Comment {
    private Integer id;
    private Integer articleId;
    private String nickname;
    private String content;
    private Date createTime;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getArticleId() {
        return articleId;
    }

    public void setArticleId(Integer articleId) {
        this.articleId = articleId;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }
}
```

## 知识点

### 实体类是什么？

实体类就像"数据的搬运工"：
- 数据库里的数据是按行存储的（一行 = 一条记录）
- Java 里操作的是对象
- 实体类就是把数据库的一行数据"翻译"成一个 Java 对象

```
数据库一行：  id=1, username=admin, password=123456
                ↓ 转换
Java 对象：   User { id=1, username="admin", password="123456" }
```

### 为什么需要 getter/setter？

- `private` 字段保证数据安全（外部不能直接修改）
- `getter` 方法让外部能读取数据
- `setter` 方法让外部能设置数据（可以加验证逻辑）

### categoryName 字段

`Article` 类里的 `categoryName` 不是数据库表的字段，而是为了在页面上显示分类名称而额外添加的。这是一种常见的"关联查询结果封装"技巧。

## 检查清单

- [ ] `User.java` 创建成功，包含所有字段和 getter/setter
- [ ] `Article.java` 创建成功，包含 `categoryName` 关联字段
- [ ] `Category.java` 创建成功
- [ ] `Comment.java` 创建成功
- [ ] 所有实体类在 `com.blog.entity` 包下
- [ ] 无编译错误
