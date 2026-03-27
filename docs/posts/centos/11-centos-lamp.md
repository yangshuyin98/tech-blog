---
title: '[11] LAMP 环境：Apache + PHP 搭建实战'
category: centos
tags: ['CentOS', 'Apache', 'PHP', 'LAMP']
date: 2026-03-20
readTime: '12 min'
order: 11
---

## 什么是 LAMP？

LAMP 是四个组件的缩写：

| 组件 | 软件 | 作用 |
|------|------|------|
| **L** | Linux | 操作系统 |
| **A** | Apache | Web 服务器 |
| **M** | MySQL/MariaDB | 数据库 |
| **P** | PHP | 服务器端脚本语言 |

## Apache 安装

### 安装

```bash
# CentOS 7 使用 httpd
yum install -y httpd

# CentOS 6 使用 apache
yum install -y httpd
```

### 启动管理

```bash
# 启动
systemctl start httpd
# 或 CentOS 6
service httpd start

# 停止
systemctl stop httpd

# 重启
systemctl restart httpd

# 查看状态
systemctl status httpd

# 开机自启
systemctl enable httpd
```

### 验证

浏览器访问 `http://服务器IP`，看到 "Testing 123" 页面说明安装成功。

### 配置文件

```bash
# 主配置文件
/etc/httpd/conf/httpd.conf

# 额外配置
/etc/httpd/conf.d/

# 模块目录
/etc/httpd/conf.modules.d/
```

### 修改站点配置

```bash
vim /etc/httpd/conf/httpd.conf
```

```apache
# 搜索 ServerName，取消注释并设置
ServerName localhost:80

# 设置默认文档目录
DocumentRoot "/var/www/html"

# 设置目录权限
<Directory "/var/www/html">
    Options Indexes FollowSymLinks
    AllowOverride All
    Require all granted
</Directory>
```

```bash
# 修改后重启
systemctl restart httpd
```

### 防火墙放行

```bash
# 开放 80 和 443 端口
firewall-cmd --permanent --add-port=80/tcp
firewall-cmd --permanent --add-port=443/tcp
firewall-cmd --reload

# 或直接开放 http 服务
firewall-cmd --permanent --add-service=http
firewall-cmd --reload
```

## PHP 安装

```bash
# 安装 PHP
yum install -y php

# 安装常用扩展
yum install -y php-mysql php-gd php-xml php-mbstring

# 验证
php -v
```

### 测试 PHP

```bash
# 创建测试文件
cd /var/www/html
vim index.php
```

```php
<?php
phpinfo();
?>
```

浏览器访问 `http://服务器IP/index.php`，如果看到 PHP 信息页面，说明 PHP 正常工作。

### PHP 配置

```bash
vim /etc/php.ini
```

常用配置项：

```ini
upload_max_filesize = 50M      ; 上传文件大小限制
post_max_size = 50M            ; POST 数据大小限制
max_execution_time = 300       ; 最大执行时间（秒）
memory_limit = 256M            ; 内存限制
date.timezone = Asia/Shanghai  ; 时区设置
```

修改后重启 Apache：

```bash
systemctl restart httpd
```

## Apache + PHP 联调

### Apache 自动处理 PHP

确保 `mod_php` 模块已加载：

```bash
ls /etc/httpd/conf.modules.d/ | grep php
# 00-php.conf 应该存在

# 如果没有，手动安装
yum install -y mod_php
```

### 多站点配置（虚拟主机）

```bash
vim /etc/httpd/conf.d/vhosts.conf
```

```apache
<VirtualHost *:80>
    ServerName a.example.com
    DocumentRoot /var/www/a
    <Directory /var/www/a>
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>

<VirtualHost *:80>
    ServerName b.example.com
    DocumentRoot /var/www/b
    <Directory /var/www/b>
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

```bash
systemctl restart httpd
```

## 日志查看

```bash
# Apache 错误日志
tail -f /var/log/httpd/error_log

# Apache 访问日志
tail -f /var/log/httpd/access_log

# 查看最近的错误
tail -50 /var/log/httpd/error_log
```

## Apache vs Nginx

| 对比 | Apache | Nginx |
|------|--------|-------|
| 模型 | 进程/线程 | 事件驱动（异步） |
| 静态资源 | 一般 | 极快 |
| 动态内容（PHP） | 内置 mod_php | 需要转发到 PHP-FPM |
| 配置 | .htaccess 支持 | 纯配置文件 |
| 内存占用 | 较高 | 较低 |
| 并发能力 | 一般 | 极强 |
| 适用场景 | 传统 PHP 项目 | 高并发、反向代理 |

::: tip 生产环境推荐
现代架构一般用 **Nginx 做前端代理 + PHP-FPM 处理动态内容**，而不是用 Apache 的 mod_php。
:::

## MariaDB 安装

```bash
# 安装 MariaDB（MySQL 的社区分支）
yum install -y mariadb-server mariadb

# 启动
systemctl start mariadb
systemctl enable mariadb

# 初始安全设置
mysql_secure_installation
# 设置 root 密码 → 删除匿名用户 → 禁止远程 root → 删除测试库
```

### 登录数据库

```bash
mysql -u root -p
```

```sql
-- 创建数据库
CREATE DATABASE myapp DEFAULT CHARACTER SET utf8mb4;

-- 创建用户
CREATE USER 'myuser'@'localhost' IDENTIFIED BY 'mypassword';

-- 授权
GRANT ALL PRIVILEGES ON myapp.* TO 'myuser'@'localhost';
FLUSH PRIVILEGES;

-- 查看数据库
SHOW DATABASES;

-- 退出
EXIT;
```

## 卸载 Apache

```bash
# 停止服务
systemctl stop httpd

# 卸载
yum remove -y httpd

# 删除配置和数据
rm -rf /etc/httpd/
rm -rf /var/www/html/
```

## 总结

| 组件 | 安装 | 启动 | 配置文件 |
|------|------|------|---------|
| Apache | `yum install -y httpd` | `systemctl start httpd` | `/etc/httpd/conf/httpd.conf` |
| PHP | `yum install -y php` | 随 Apache 启动 | `/etc/php.ini` |
| MariaDB | `yum install -y mariadb-server` | `systemctl start mariadb` | `/etc/my.cnf` |
| 站点目录 | — | — | `/var/www/html/` |
| 日志 | — | — | `/var/log/httpd/` |

**下一篇**：Docker 容器化部署——安装、镜像、容器管理。
