---
title: '事件驱动架构实战：从 Kafka 到 EventStoreDB 的选型之路'
category: arch
tags: ['EDA', 'Kafka']
date: 2026-03-05
readTime: '20 min'
---

## 事件驱动架构的核心概念
EDA（Event-Driven Architecture）以**事件**作为系统间通信的主要方式。事件 = 系统中发生的事实，一旦产生不可更改。

- **Event Notification** — 通知其他系统发生了什么
- **Event-Carried State Transfer** — 事件携带完整状态
- **Event Sourcing** — 事件作为数据的唯一来源

## Kafka 作为事件总线
Kafka 擅长**高吞吐、持久化、可回溯**的消息传递：

```java
@KafkaListener(topics = "order-events")
public void handleOrderEvent(ConsumerRecord<String, OrderEvent> record) {
    OrderEvent event = record.value();
    switch (event.getType()) {
        case CREATED  -> inventoryService.reserve(event.getItems());
        case PAID     -> shippingService.schedule(event.getOrderId());
        case CANCELLED -> inventoryService.release(event.getItems());
    }
}
```

## EventStoreDB 做事件溯源
EventStoreDB 专门为 Event Sourcing 设计：**存储事件流，而非当前状态。**

## 选型对比
| 维度 | Kafka | EventStoreDB |
| --- | --- | --- |
| 定位 | 分布式消息队列 | 事件溯源数据库 |
| 查询能力 | 按 topic/partition | 按 stream + 投影 |
| Consumer Group | ✅ | ❌（使用投影） |
| 适用场景 | 事件通知、流处理 | Event Sourcing、CQRS |

::: tip 实战建议
两者**不是替代关系**。典型做法：EventStoreDB 存储聚合根的事件流（source of truth），Kafka 做跨服务事件传播。通过投影把 EventStoreDB 的事件推送到 Kafka topic。
:::

## 总结
EDA 不是一步到位的。先从 Event Notification 开始（最低成本），在核心域引入 Event Sourcing，用 Kafka 作为事件总线连接一切。
