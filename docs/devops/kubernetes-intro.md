---
title: Kubernetes 入门指南
date: 2026-05-07
tags: ['K8s', '容器编排', 'DevOps']
readTime: '15 min'
---

# Kubernetes 入门指南

Kubernetes（K8s）是一个开源的容器编排系统，用于自动化部署、扩展和管理容器化应用。

## 为什么需要 Kubernetes

当应用规模增大，单靠 Docker 手动管理容器变得困难：
- 如何管理成百上千个容器？
- 如何实现自动扩缩容？
- 如何实现服务发现和负载均衡？
- 如何实现滚动更新和回滚？

Kubernetes 解决了这些问题。

## 核心概念

### Pod

Pod 是 K8s 最小的部署单元，包含一个或多个容器：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
spec:
  containers:
  - name: my-container
    image: nginx:latest
    ports:
    - containerPort: 80
```

### Deployment

Deployment 用于管理 Pod 的副本和更新：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: my-container
        image: nginx:latest
        ports:
        - containerPort: 80
```

### Service

Service 用于暴露应用，提供负载均衡：

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: my-app
  ports:
  - port: 80
    targetPort: 80
  type: LoadBalancer
```

## 安装 K8s

### 使用 minikube（本地开发）

```bash
# 安装 minikube
curl -LO https://storage.googleapis.com/minikube/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube

# 启动集群
minikube start
```

### 使用 kubectl

```bash
# 安装 kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install kubectl /usr/local/bin/kubectl
```

## 常用命令

```bash
# 查看集群信息
kubectl cluster-info

# 查看节点
kubectl get nodes

# 查看 Pod
kubectl get pods

# 部署应用
kubectl apply -f deployment.yaml

# 查看日志
kubectl logs my-pod

# 进入容器
kubectl exec -it my-pod -- /bin/bash
```

## 总结

Kubernetes 是生产级的容器编排平台，适合大规模微服务架构。学习曲线较陡，但掌握后能极大提升运维效率。
