# 阶段2：数据库设计

## 目标
创建博客系统所需的数据库和表结构，包括用户表、文章表、评论表等。

## 前置条件
- MySQL 已安装并能正常连接
- 阶段1项目搭建完成

## 操作步骤

### 2.1 创建数据库

使用 MySQL 客户端（Navicat / MySQL Workbench / 命令行）执行以下 SQL：

```sql
-- 创建数据库
CREATE DATABASE IF NOT EXISTS blog DEFAULT CHARSET utf8mb4 COLLATE utf8mb4_general_ci;

-- 使用数据库
USE blog;
```

### 2.2 创建用户表（user）

用户表存储博主的账号密码信息。

```sql
USE blog;
CREATE TABLE `user` (
    `id` INT PRIMARY KEY AUTO_INCREMENT COMMENT '用户ID',
    `username` VARCHAR(50) NOT NULL COMMENT '用户名',
    `password` VARCHAR(100) NOT NULL COMMENT '密码（MD5加密后存储）',
    `nickname` VARCHAR(50) DEFAULT NULL COMMENT '昵称',
    `avatar` VARCHAR(200) DEFAULT NULL COMMENT '头像路径',
    `email` VARCHAR(100) DEFAULT NULL COMMENT '邮箱',
    `signature` VARCHAR(200) DEFAULT NULL COMMENT '个性签名',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';
```

### 2.3 创建文章分类表（category）

```sql
USE blog;
CREATE TABLE `category` (
    `id` INT PRIMARY KEY AUTO_INCREMENT COMMENT '分类ID',
    `name` VARCHAR(50) NOT NULL COMMENT '分类名称',
    `sort` INT DEFAULT 0 COMMENT '排序号'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文章分类表';
```

### 2.4 创建文章表（article）

```sql
USE blog;
CREATE TABLE `article` (
    `id` INT PRIMARY KEY AUTO_INCREMENT COMMENT '文章ID',
    `title` VARCHAR(200) NOT NULL COMMENT '文章标题',
    `content` TEXT COMMENT '文章内容',
    `summary` VARCHAR(500) DEFAULT NULL COMMENT '文章摘要（截取前200字）',
    `category_id` INT DEFAULT NULL COMMENT '分类ID',
    `tags` VARCHAR(200) DEFAULT NULL COMMENT '标签（多个标签用逗号分隔）',
    `view_count` INT DEFAULT 0 COMMENT '阅读次数',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (`category_id`) REFERENCES `category`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文章表';
```

### 2.5 创建评论表（comment）

```sql
USE blog;
CREATE TABLE `comment` (
    `id` INT PRIMARY KEY AUTO_INCREMENT COMMENT '评论ID',
    `article_id` INT NOT NULL COMMENT '文章ID',
    `nickname` VARCHAR(50) NOT NULL COMMENT '评论者昵称',
    `content` VARCHAR(500) NOT NULL COMMENT '评论内容',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '评论时间',
    FOREIGN KEY (`article_id`) REFERENCES `article`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评论表';
```

### 2.6 插入测试数据

```sql
-- 插入博主账号（密码为 123456 的 MD5 值，后续阶段会替换为加密后的值）
INSERT INTO `user` (`username`, `password`, `nickname`, `signature`)
VALUES ('admin', '123456', '博主', '热爱技术，热爱生活');

-- 插入文章分类
INSERT INTO `category` (`name`, `sort`) VALUES
('Java', 1),
('框架', 2),
('数据库', 3),
('生活感悟', 4),
('前端', 5);

-- 插入测试文章
INSERT INTO `article` (`title`, `content`, `summary`, `category_id`, `tags`, `view_count`) VALUES
('Java 基础入门', 'Java 是一门面向对象的编程语言...', 'Java 是一门面向对象的编程语言，本文介绍基础入门知识。', 1, 'Java,入门', 150),
('Spring Boot 快速上手', 'Spring Boot 让 Java 开发变得更简单...', 'Spring Boot 让 Java 开发变得更简单，本文带你快速上手。', 2, 'Spring Boot,框架', 230),
('MySQL 索引优化', '索引是数据库性能优化的关键...', '索引是数据库性能优化的关键，本文详解索引原理与实践。', 3, 'MySQL,索引,优化', 180),
('我的 2025 年总结', '回顾这一年，收获满满...', '回顾这一年，收获满满，分享我的成长与感悟。', 4, '生活,总结', 95),
('Vue 3 组合式 API', 'Vue 3 引入了组合式 API...', 'Vue 3 引入了组合式 API，让代码组织更灵活。', 5, 'Vue,前端,框架', 120);

-- 插入测试评论
INSERT INTO `comment` (`article_id`, `nickname`, `content`) VALUES
(1, '读者A', '写得很清楚，感谢分享！'),
(1, '读者B', '刚好在学 Java，很有帮助。'),
(2, '小明', 'Spring Boot 确实好用！'),
(3, 'DBA老张', '索引优化讲得很到位。');
```

## 知识点

### 外键（Foreign Key）

外键就像"身份证关联"：
- `article` 表的 `category_id` 指向 `category` 表的 `id`
- 这意味着每篇文章必须属于一个已存在的分类
- 如果尝试删除一个还有文章的分类，数据库会阻止你（这就是数据完整性）

### 表关系图

```
┌──────────┐       ┌──────────────┐       ┌───────────┐
│  user    │       │   article    │       │  category │
├──────────┤       ├──────────────┤       ├───────────┤
│ id (PK)  │       │ id (PK)      │       │ id (PK)   │
│ username │       │ title        │       │ name      │
│ password │       │ content      │──────▶│ sort      │
│ nickname │       │ category_id ─┘       └───────────┘
│ avatar   │       │ tags
│ email    │       │ view_count
│ signature│       │ create_time
└──────────┘       └──────┬───────┘
                          │
                          │ 1:N
                          ▼
                   ┌──────────────┐
                   │   comment    │
                   ├──────────────┤
                   │ id (PK)      │
                   │ article_id ──┘
                   │ nickname
                   │ content
                   └──────────────┘
```

## 检查清单

- [ ] 数据库 `blog` 创建成功
- [ ] `user` 表创建成功，字段完整
- [ ] `category` 表创建成功
- [ ] `article` 表创建成功，外键关联 category 表
- [ ] `comment` 表创建成功，外键关联 article 表
- [ ] 测试数据插入成功（1个用户、5个分类、5篇文章、4条评论）
- [ ] 执行 `SELECT * FROM article;` 能查到数据
