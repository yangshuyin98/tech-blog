---
title: '[10] Nginx 源码编译安装：从下载到配置'
category: centos
tags: ['CentOS', 'Nginx', '源码编译', 'Web服务器']
date: 2026-03-19
readTime: '16 min'
order: 10
---

## Nginx 是什么？

Nginx（读作 engine-x）是高性能的 **Web 服务器**和**反向代理**工具。国内互联网公司几乎全部使用 Nginx。

| 功能 | 说明 |
|------|------|
| 静态资源服务 | 图片、HTML、CSS、JS |
| 反向代理 | 转发请求到后端服务 |
| 负载均衡 | 多个后端服务分摊流量 |
| SSL/TLS 终端 | HTTPS 处理 |
| 缓存 | 缓存后端响应 |

## 下载与解压

```bash
# 进入源码目录
cd /usr/local/src/

# 下载 Nginx 源码包
wget https://nginx.org/download/nginx-1.26.3.tar.gz

# 解压
tar -zxvf nginx-1.26.3.tar.gz

# 进入解压目录
cd nginx-1.26.3/
```

## 安装依赖

```bash
# PCRE：正则表达式库（URL 重写需要）
yum install -y pcre-devel

# zlib：压缩库
yum install -y zlib-devel

# OpenSSL：SSL/TLS 支持（HTTPS 需要）
yum install -y openssl openssl-devel
```

::: tip 依赖说明
- **pcre-devel** — 提供正则表达式支持，`rewrite` 模块必须
- **zlib-devel** — 提供 gzip 压缩支持
- **openssl-devel** — 提供 HTTPS 支持
:::

## 编译安装

### 第 1 步：configure（配置）

```bash
./configure --prefix=/usr/local/nginx \
    --with-pcre \
    --with-zlib=/usr/local/src/zlib-1.2.11 \
    --with-http_ssl_module
```

常用配置参数：

| 参数 | 说明 |
|------|------|
| `--prefix=/usr/local/nginx` | 安装目录 |
| `--with-pcre` | 启用 PCRE 支持 |
| `--with-zlib` | 指定 zlib 源码路径 |
| `--with-http_ssl_module` | 启用 HTTPS |
| `--with-http_v2_module` | 启用 HTTP/2 |
| `--with-http_stub_status_module` | 状态监控 |
| `--without-http_gzip_module` | 禁用 gzip（默认开启） |

成功输出：

```
Configuration summary
 + using system PCRE library
 + using system OpenSSL library
 + using zlib library: /usr/lib/
```

::: warning configure 报错处理
- **"No such file or directory: pcre"** → `yum install -y pcre-devel`
- **"No such file or directory: zlib"** → `yum install -y zlib-devel`
- **"OpenSSL library not found"** → `yum install -y openssl-devel`
:::

### 第 2 步：make（编译）

```bash
make
```

### 第 3 步：make install（安装）

```bash
make install
```

### 验证安装

```bash
ls /usr/local/nginx/
# conf  html  logs  sbin

ls /usr/local/nginx/sbin/
# nginx
```

## Nginx 常用命令

```bash
# 启动
/usr/local/nginx/sbin/nginx

# 停止
/usr/local/nginx/sbin/nginx -s stop
# 或
kill $(cat /usr/local/nginx/logs/nginx.pid)

# 优雅停止（处理完当前请求再停）
/usr/local/nginx/sbin/nginx -s quit

# 重载配置（不中断服务）
/usr/local/nginx/sbin/nginx -s reload

# 重新打开日志文件（日志切割）
/usr/local/nginx/sbin/nginx -s reopen

# 检查配置文件语法
/usr/local/nginx/sbin/nginx -t

# 查看版本
/usr/local/nginx/sbin/nginx -v

# 查看编译参数
/usr/local/nginx/sbin/nginx -V
```

### 添加到 PATH

```bash
# 临时添加
export PATH=$PATH:/usr/local/nginx/sbin

# 永久添加
echo 'export PATH=$PATH:/usr/local/nginx/sbin' >> ~/.bashrc
source ~/.bashrc

# 之后直接使用
nginx
nginx -s reload
nginx -t
```

## 配置文件

```bash
vim /usr/local/nginx/conf/nginx.conf
```

### 基础配置示例

```nginx
# 工作进程数（建议 = CPU 核心数）
worker_processes  1;

events {
    worker_connections  1024;  # 每个进程最大连接数
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    # 日志格式
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  logs/access.log  main;

    sendfile        on;
    keepalive_timeout  65;

    # 虚拟主机（站点）
    server {
        listen       80;
        server_name  localhost;

        location / {
            root   html;
            index  index.html index.htm;
        }

        # 错误页面
        error_page  500 502 503 504 /50x.html;
        location = /50x.html {
            root html;
        }
    }
}
```

### 反向代理配置

```nginx
server {
    listen 80;
    server_name www.example.com;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### 多站点（虚拟主机）

```nginx
# 站点 A
server {
    listen 80;
    server_name a.example.com;
    root /var/www/a;
    index index.html;
}

# 站点 B
server {
    listen 80;
    server_name b.example.com;
    root /var/www/b;
    index index.html;
}
```

### 设置开机自启

```bash
vim /etc/systemd/system/nginx.service
```

```ini
[Unit]
Description=nginx
After=network.target

[Service]
Type=forking
ExecStart=/usr/local/nginx/sbin/nginx
ExecReload=/usr/local/nginx/sbin/nginx -s reload
ExecStop=/usr/local/nginx/sbin/nginx -s quit
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

```bash
systemctl daemon-reload
systemctl enable nginx
systemctl start nginx
```

## 卸载编译安装的软件

编译安装的软件不会在 yum 的管理范围内，手动删除：

```bash
# 1. 先停止服务
nginx -s stop
# 或
systemctl stop nginx

# 2. 删除安装目录
rm -rf /usr/local/nginx/

# 3. 删除服务文件（如果有）
rm -f /etc/systemd/system/nginx.service
systemctl daemon-reload
```

## 常见问题

### 80 端口被占用

```bash
# 查看谁占用了 80 端口
ss -tlnp | grep :80

# 停止 Apache
systemctl stop httpd
systemctl disable httpd
```

### 防火墙拦截

```bash
firewall-cmd --permanent --add-port=80/tcp
firewall-cmd --reload
```

## 总结

| 步骤 | 命令 |
|------|------|
| 下载 | `wget https://nginx.org/download/...` |
| 解压 | `tar -zxvf nginx-*.tar.gz` |
| 安装依赖 | `yum install -y pcre-devel zlib-devel openssl-devel` |
| 配置 | `./configure --prefix=/usr/local/nginx` |
| 编译 | `make` |
| 安装 | `make install` |
| 启动 | `nginx` |
| 重载 | `nginx -s reload` |
| 检查配置 | `nginx -t` |

**下一篇**：LAMP 环境搭建——Apache + PHP 部署。
