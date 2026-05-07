---
title: Docker 基础入门
date: 2026-05-07
tags: ['Docker', '容器', 'DevOps']
readTime: '15 min'
---

# Docker 基础入门

Docker 是一个开源的应用容器引擎，让开发者可以打包应用及其依赖包到一个可移植的容器中。

## 什么是容器

容器是一种轻量级的虚拟化技术，与虚拟机不同，容器共享宿主机的操作系统内核。

## 安装 Docker

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install docker.io
sudo systemctl start docker
sudo systemctl enable docker

# CentOS/RHEL
sudo yum install docker
sudo systemctl start docker
sudo systemctl enable docker
```

## 基本概念

- **镜像（Image）**：只读模板，包含运行应用所需的所有内容
- **容器（Container）**：镜像的运行实例
- **仓库（Registry）**：存储镜像的地方，如 Docker Hub

## 基本命令

### 镜像操作

```bash
# 搜索镜像
docker search nginx

# 拉取镜像
docker pull nginx

# 查看本地镜像
docker images

# 删除镜像
docker rmi nginx
```

### 容器操作

```bash
# 运行容器
docker run -d -p 80:80 --name my-nginx nginx

# 查看运行中的容器
docker ps

# 查看所有容器
docker ps -a

# 停止容器
docker stop my-nginx

# 启动容器
docker start my-nginx

# 删除容器
docker rm my-nginx
```

## Dockerfile

Dockerfile 用于构建自定义镜像：

```dockerfile
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY target/myapp.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
```

构建镜像：

```bash
docker build -t myapp:1.0 .
```

## Docker Compose

Docker Compose 用于定义和运行多容器应用：

```yaml
version: '3'
services:
  web:
    build: .
    ports:
      - "8080:8080"
  db:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: password
    volumes:
      - db-data:/var/lib/mysql

volumes:
  db-data:
```

启动服务：

```bash
docker-compose up -d
```

## 总结

Docker 极大地简化了应用的部署和运维，是现代 DevOps 的基础工具。
