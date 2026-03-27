---
title: '分布式 ID 生成方案深度对比：Snowflake vs ULID vs UUIDv7'
category: backend
tags: ['分布式', '系统设计']
date: 2026-03-14
readTime: '8 min'
---

## 分布式 ID 的核心需求

- **全局唯一** — 不能有冲突
- **趋势递增** — 数据库索引友好
- **高可用** — 不能依赖单点
- **高性能** — 每秒百万级生成
- **可排序** — 按时间排序不需要额外字段

## Snowflake
Twitter 开发的 64 位 ID 方案：`1位符号 | 41位时间戳 | 10位机器ID | 12位序列号`

```java
public class SnowflakeIdGenerator {
    private final long datacenterId;
    private final long workerId;
    private long sequence = 0L;
    private long lastTimestamp = -1L;

    public synchronized long nextId() {
        long timestamp = System.currentTimeMillis();
        if (timestamp == lastTimestamp) {
            sequence = (sequence + 1) & 0xFFF; // 12位
            if (sequence == 0) timestamp = waitNextMillis(lastTimestamp);
        } else {
            sequence = 0L;
        }
        lastTimestamp = timestamp;

        return ((timestamp - EPOCH) << 22)
             | (datacenterId << 17)
             | (workerId << 12)
             | sequence;
    }
}
```

## ULID
128 位，Base32 编码（26 字符），天然排序友好，无需协调节点：

```text
01ARZ3NDEKTSV4RRFFQ69G5FAV
├── 48位时间戳(ms) ──┤ 80位随机数 ──┤
```

## UUIDv7
2024 年正式标准化，结合了时间排序和随机性：`时间戳 | 随机 | 版本位`

## 三维度对比
| 维度 | Snowflake | ULID | UUIDv7 |
| --- | --- | --- | --- |
| 长度 | 64位 (8字节) | 128位 (16字节) | 128位 (16字节) |
| 可排序 | ✅ | ✅ | ✅ |
| 需要协调 | 需要 workerId | ❌ | ❌ |
| 时钟回拨 | ⚠️ 需处理 | ⚠️ 可能 | ⚠️ 可能 |
| 数据库友好 | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ |
| 可读性 | 数字 | Base32 字符串 | 标准 UUID 格式 |

::: tip 选型建议
单体或简单分布式系统 → **Snowflake**（最成熟）
微服务无中心协调 → **ULID**（最简单）
需要与现有 UUID 生态兼容 → **UUIDv7**（标准化方案）
:::
