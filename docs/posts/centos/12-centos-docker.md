---
title: '[12] Docker 容器化部署：安装、镜像与容器管理'
category: centos
tags: ['CentOS', 'Docker', '容器', 'DevOps']
date: 2026-03-21
readTime: '16 min'
order: 12
---

## Docker 是什么？

Docker 是**容器化**平台，把应用和它的依赖打包成一个**容器**，在任何机器上都能运行。

```
传统部署：代码 → 找服务器 → 装依赖 → 配环境 → 跑起来（换台机器全废）

Docker 部署：代码 → build 镜像 → run 容器（任何装了 Docker 的机器都能跑）
```

### 容器 vs 虚拟机

| 对比 | 容器 | 虚拟机 |
|------|------|--------|
| 启动 | 秒级 | 分钟级 |
| 资源占用 | MB 级 | GB 级 |
| 隔离级别 | 进程级 | 操作系统级 |
| 性能 | 接近原生 | 有损耗 |

### 核心概念

| 概念 | 类比 | 说明 |
|------|------|------|
| **镜像 Image** | 光盘镜像 | 只读模板，包含代码、运行时、依赖 |
| **容器 Container** | 运行的程序 | 镜像的运行实例，可读写 |
| **仓库 Registry** | 应用商店 | 存放镜像的地方（Docker Hub） |

## 安装 Docker

### 卸载旧版本

```bash
sudo yum remove -y docker docker-client docker-client-latest \
  docker-common docker-latest docker-latest-logrotate \
  docker-logrotate docker-engine
```

### 安装依赖

```bash
sudo yum install -y yum-utils device-mapper-persistent-data lvm2
```

### 添加 Docker 仓库

```bash
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
```

### 安装 Docker

```bash
# 安装容器运行时依赖
sudo yum install -y epel-release
sudo yum install -y container-selinux

# 清理并重建缓存
sudo yum clean all
sudo yum makecache fast

# 安装 Docker CE
sudo yum install -y docker-ce docker-ce-cli containerd.io
```

### 启动 Docker

```bash
# 启动
sudo systemctl start docker

# 开机自启
sudo systemctl enable docker

# 验证安装
sudo docker run hello-world
```

### 检查安装

```bash
# 查看版本
docker --version

# 查看状态
sudo systemctl status docker
# Active: active (running)

# 查看镜像
sudo docker images

# 查看容器
sudo docker ps -a
```

## 配置国内镜像加速

Docker Hub 在国内很慢，配置镜像加速：

```bash
sudo mkdir -p /etc/docker

sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": [
    "https://mirror.ccs.tencentyun.com",
    "https://registry.docker-cn.com"
  ]
}
EOF

# 重启 Docker
sudo systemctl daemon-reload
sudo systemctl restart docker
```

## 镜像管理

```bash
# 搜索镜像
docker search nginx

# 拉取镜像
docker pull nginx
docker pull nginx:1.26       # 指定版本
docker pull mysql:8.0

# 查看本地镜像
docker images

# 查看镜像详情
docker inspect nginx

# 删除镜像
docker rmi nginx
docker rmi $(docker images -q)  # 删除所有
```

## 容器管理

### 基础操作

```bash
# 运行容器（前台）
docker run nginx

# 运行容器（后台 + 端口映射）
docker run -d -p 80:80 --name web nginx

# 参数说明
# -d           后台运行（detached）
# -p 80:80     主机端口:容器端口
# --name       容器名称
# -e           环境变量
# -v           挂载目录
# --restart    自动重启策略

# 查看运行中的容器
docker ps

# 查看所有容器
docker ps -a

# 停止容器
docker stop web

# 启动已停止的容器
docker start web

# 重启容器
docker restart web

# 删除容器（先停止）
docker rm web

# 强制删除运行中的容器
docker rm -f web

# 查看容器日志
docker logs web
docker logs -f web         # 实时跟踪
docker logs --tail 100 web # 最后 100 行
```

### 进入容器

```bash
# 进入容器的 bash
docker exec -it web /bin/bash

# 在容器中执行命令
docker exec web ls /usr/share/nginx/html
```

### 常用容器示例

```bash
# Nginx（Web 服务器）
docker run -d -p 80:80 --name web nginx

# MySQL
docker run -d -p 3306:3306 \
  --name mysql \
  -e MYSQL_ROOT_PASSWORD=123456 \
  -e MYSQL_DATABASE=myapp \
  -v mysql_data:/var/lib/mysql \
  mysql:8.0

# Redis
docker run -d -p 6379:6379 --name redis redis

# PHP
docker run -d -p 9000:9000 \
  --name php \
  -v /var/www/html:/var/www/html \
  php:8.2-fpm

# Tomcat（Java Web）
docker run -d -p 8080:8080 --name tomcat tomcat:9
```

## 数据卷（Volume）

容器内的数据是临时的，容器删除后数据就没了。用**数据卷**持久化：

```bash
# 创建数据卷
docker volume create mysql_data

# 查看数据卷
docker volume ls

# 查看数据卷详情
docker volume inspect mysql_data

# 挂载数据卷
docker run -d -v mysql_data:/var/lib/mysql mysql:8.0

# 挂载宿主机目录
docker run -d -v /opt/html:/usr/share/nginx/html -p 80:80 nginx

# 删除数据卷
docker volume rm mysql_data
```

## Dockerfile 构建镜像

```bash
# 创建 Dockerfile
vim Dockerfile
```

```dockerfile
# 基础镜像
FROM centos:7

# 安装依赖
RUN yum install -y epel-release && \
    yum install -y python3 python3-pip

# 设置工作目录
WORKDIR /app

# 复制代码
COPY . .

# 安装依赖
RUN pip3 install -r requirements.txt

# 暴露端口
EXPOSE 8000

# 启动命令
CMD ["python3", "app.py"]
```

```bash
# 构建镜像
docker build -t myapp:v1 .

# 推送镜像到 Docker Hub
docker login
docker tag myapp:v1 username/myapp:v1
docker push username/myapp:v1
```

## docker-compose

多个容器编排（Nginx + PHP + MySQL）：

```yaml
# docker-compose.yml
version: '3'
services:
  web:
    image: nginx:1.26
    ports:
      - "80:80"
    volumes:
      - ./html:/usr/share/nginx/html
    depends_on:
      - php

  php:
    image: php:8.2-fpm
    volumes:
      - ./html:/var/www/html

  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: 123456
      MYSQL_DATABASE: myapp
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

```bash
# 启动所有服务
docker-compose up -d

# 查看状态
docker-compose ps

# 停止
docker-compose down

# 重新构建并启动
docker-compose up -d --build
```

## 常用命令速查

| 命令 | 作用 |
|------|------|
| `docker pull image` | 拉取镜像 |
| `docker run -d -p 80:80 --name c1 image` | 运行容器 |
| `docker ps` | 查看运行中容器 |
| `docker ps -a` | 查看所有容器 |
| `docker stop/start/restart c1` | 停止/启动/重启容器 |
| `docker logs -f c1` | 查看日志 |
| `docker exec -it c1 /bin/bash` | 进入容器 |
| `docker rm -f c1` | 删除容器 |
| `docker rmi image` | 删除镜像 |
| `docker volume ls` | 查看数据卷 |
| `docker system prune` | 清理无用资源 |

## 总结

Docker 把"环境配置"从人工变成了**代码化、可复现**的操作：

- **镜像** = 应用 + 依赖 + 环境
- **容器** = 镜像的运行实例
- **数据卷** = 容器数据持久化
- **Dockerfile** = 构建镜像的说明书
- **docker-compose** = 多容器编排

---

**CentOS 系列完结** 🎉 12 篇覆盖了从系统安装到 Docker 部署的完整运维知识，建议按顺序学习。
