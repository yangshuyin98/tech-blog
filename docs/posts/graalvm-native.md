---
title: 'GraalVM Native Image：Spring Boot 启动速度从 3s 到 50ms'
category: springboot
tags: ['GraalVM', 'Java']
date: 2026-03-08
readTime: '16 min'
---

## 为什么需要 Native Image？
Spring Boot 应用启动通常需要 2-5 秒。在 Serverless、容器化场景下，冷启动时间直接影响用户体验和成本。GraalVM Native Image 可以将 Spring Boot 编译为独立的可执行文件，启动时间降至**50 毫秒**，内存占用降至**原来的 1/5**。

## 基本用法
```bash
# 使用 Spring Boot Maven 插件
./mvnw -Pnative native:compile

# 使用 Gradle
./gradlew nativeCompile
```

## 常见坑与解决方案
| 问题 | 原因 | 解决方案 |
| --- | --- | --- |
| 反射报错 | GraalVM 编译时分析不到运行时反射 | 添加 `reflect-config.json` |
| 资源找不到 | 资源文件未打包进镜像 | 配置 `resource-config.json` |
| 代理类失败 | 动态代理在 AOT 中不可用 | 使用 `@NativeHint` |

::: tip CI/CD 集成
Native Image 编译需要大量内存（建议 16GB+）和时间（5-15 分钟）。建议在 CI 中使用专门的构建机器，配合 Docker 多阶段构建。
:::

## 总结
GraalVM Native Image 不适合所有场景——如果你的应用大量使用反射、动态代理或运行时代码生成，AOT 兼容性可能是个挑战。但对于大多数 CRUD 应用和服务，它是 Serverless 和容器化部署的绝佳选择。
