---
title: Redis 快速入门
date: 2026-05-07
tags: ['Redis', '缓存', 'NoSQL']
readTime: '10 min'
---

# Redis 快速入门

Redis 是一个开源的内存数据结构存储，可用作数据库、缓存和消息中间件。

## Redis 的特点

- **高性能**：数据存储在内存中，读写速度极快
- **丰富的数据类型**：String、List、Set、Hash、ZSet
- **持久化**：支持 RDB 和 AOF 两种持久化方式
- **主从复制**：支持数据复制和高可用

## 安装 Redis

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install redis-server

# CentOS/RHEL
sudo yum install redis
sudo systemctl start redis
```

## 基本操作

### String 类型

```bash
SET name "张三"
GET name
SET counter 100
INCR counter
```

### List 类型

```bash
LPUSH mylist "item1"
LPUSH mylist "item2"
LRANGE mylist 0 -1
```

### Hash 类型

```bash
HSET user:1 name "张三"
HSET user:1 email "zhangsan@example.com"
HGETALL user:1
```

### Set 类型

```bash
SADD myset "member1"
SADD myset "member2"
SMEMBERS myset
```

## 在 Java 中使用 Redis

使用 Jedis 或 Lettuce 客户端：

```java
Jedis jedis = new Jedis("localhost", 6379);
jedis.set("name", "张三");
String name = jedis.get("name");
jedis.close();
```

## 总结

Redis 是一个非常强大的工具，特别适合做缓存、会话存储、排行榜等场景。
