---
title: MongoDB 入门指南
date: 2026-05-07
tags: ['MongoDB', 'NoSQL', '文档数据库']
readTime: '10 min'
---

# MongoDB 入门指南

MongoDB 是一个基于分布式文件存储的开源数据库系统，属于 NoSQL 数据库。

## MongoDB 的特点

- **文档存储**：数据以 JSON 格式的文档存储
- **灵活的模式**：不需要预先定义表结构
- **高可扩展性**：支持水平扩展和分片
- **丰富的查询语言**：支持复杂的查询和聚合

## 安装 MongoDB

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install mongodb

# CentOS/RHEL
sudo yum install mongodb-org
sudo systemctl start mongod
```

## 基本概念

- **数据库（Database）**：存储集合的容器
- **集合（Collection）**：类似于关系数据库的表
- **文档（Document）**：类似于关系数据库的行，以 BSON 格式存储

## 基本操作

### 创建数据库和集合

```javascript
use mydb
db.createCollection("users")
```

### 插入文档

```javascript
db.users.insertOne({
  name: "张三",
  email: "zhangsan@example.com",
  age: 25
})

db.users.insertMany([
  { name: "李四", age: 30 },
  { name: "王五", age: 28 }
])
```

### 查询文档

```javascript
// 查询所有
db.users.find()

// 条件查询
db.users.find({ age: { $gt: 25 } })

// 投影
db.users.find({}, { name: 1, email: 1 })
```

### 更新文档

```javascript
db.users.updateOne(
  { name: "张三" },
  { $set: { age: 26 } }
)
```

### 删除文档

```javascript
db.users.deleteOne({ name: "张三" })
```

## 在 Java 中使用 MongoDB

使用 MongoDB Java Driver：

```java
MongoClient mongoClient = new MongoClient("localhost", 27017);
MongoDatabase database = mongoClient.getDatabase("mydb");
MongoCollection<Document> collection = database.getCollection("users");

Document doc = new Document("name", "张三")
    .append("email", "zhangsan@example.com");
collection.insertOne(doc);
```

## 总结

MongoDB 适合存储结构不固定的数据，特别适合内容管理系统、用户数据、日志等场景。
