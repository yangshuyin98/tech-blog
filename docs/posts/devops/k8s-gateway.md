---
title: 'Kubernetes Gateway API：告别 Ingress 的下一代流量管理'
category: devops
tags: ['K8s', 'Gateway']
date: 2026-03-10
readTime: '14 min'
---

## Ingress 的局限性
传统 Ingress 资源功能有限：不支持流量分割、不支持 TCP/UDP、配置表达力弱。每个 Ingress Controller 又有各自的注解方言。

## Gateway API 的设计思想
Gateway API 采用**角色分离**模型：

- **GatewayClass** — 基础设施提供者定义（类似 StorageClass）
- **Gateway** — 运维人员配置（监听端口、TLS）
- **HTTPRoute** — 开发人员配置（路由规则）

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: app-route
spec:
  parentRefs:
  - name: my-gateway
  rules:
  - matches:
    - path:
        type: PathPrefix
        value: /api
    backendRefs:
    - name: api-service
      port: 8080
      weight: 90
    - name: api-canary
      port: 8080
      weight: 10  # 金丝雀发布
```

## 对比 Ingress
| 特性 | Ingress | Gateway API |
| --- | --- | --- |
| 协议支持 | HTTP/HTTPS | HTTP/TCP/UDP/gRPC |
| 流量分割 | 需要注解 | 原生支持 |
| 角色分离 | ❌ | ✅ |
| 跨实现 | 注解不通用 | 标准 CRD |
| 状态反馈 | 有限 | 丰富的 status 条件 |

## 总结
Gateway API 正在成为 Kubernetes 流量管理的标准。如果你还在用 Ingress 注解地狱，是时候迁移到 Gateway API 了。
