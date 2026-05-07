---
title: MySQL 基础入门
date: 2026-05-07
tags: ['MySQL', '数据库', '入门']
readTime: '12 min'
---

# MySQL 基础入门

MySQL 是最流行的关系型数据库管理系统之一。

## 什么是关系型数据库

关系型数据库将数据存储在表中，表与表之间可以建立关联关系。

## 安装 MySQL

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install mysql-server

# CentOS/RHEL
sudo yum install mysql-server
sudo systemctl start mysqld
```

## 基本操作

### 创建数据库

```sql
CREATE DATABASE mydb;
USE mydb;
```

### 创建表

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### CRUD 操作

```sql
-- 插入
INSERT INTO users (username, email) VALUES ('zhangsan', 'zhangsan@example.com');

-- 查询
SELECT * FROM users WHERE username = 'zhangsan';

-- 更新
UPDATE users SET email = 'new@example.com' WHERE id = 1;

-- 删除
DELETE FROM users WHERE id = 1;
```

## 索引

索引可以大大提高查询效率：

```sql
CREATE INDEX idx_username ON users(username);
```

## 总结

掌握 SQL 基础语法是学习数据库的第一步，后续还需要学习事务、锁、优化等高级内容。
