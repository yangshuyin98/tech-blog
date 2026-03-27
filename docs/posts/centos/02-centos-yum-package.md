---
title: '[02] YUM 包管理：安装、卸载、换源与缓存'
category: centos
tags: ['CentOS', 'YUM', '包管理']
date: 2026-03-11
readTime: '12 min'
order: 2
---

## YUM 是什么？

YUM（Yellowdog Updater Modified）是 CentOS 的**包管理器**，类似手机上的应用商店——一行命令就能安装、卸载、更新软件。

```bash
yum install vim        # 安装 vim
yum remove vim         # 卸载 vim
yum update vim         # 更新 vim
yum search nginx       # 搜索软件
```

## 基础命令

```bash
# 安装软件
yum install -y vim         # -y 自动确认

# 卸载软件
yum remove -y vim

# 更新软件
yum update vim             # 更新指定软件
yum update -y              # 更新所有软件

# 搜索软件
yum search nginx

# 查看软件信息
yum info nginx

# 列出已安装的软件
yum list installed

# 查看是否安装
yum list installed | grep vim
```

## 配置国内源

默认的 CentOS 源在国外，下载速度很慢。换成阿里云镜像：

### 备份原配置

```bash
mv /etc/yum.repos.d/CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo.bak
```

### 下载阿里云源

```bash
# CentOS 6
wget -O /etc/yum.repos.d/CentOS-Base.repo https://mirrors.aliyun.com/repo/Centos-vault-6.10.repo
# 或
curl -o /etc/yum.repos.d/CentOS-Base.repo https://mirrors.aliyun.com/repo/Centos-vault-6.10.repo

# CentOS 7
wget -O /etc/yum.repos.d/CentOS-Base.repo https://mirrors.aliyun.com/repo/Centos-7.repo
# 或
curl -o /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo
```

### 清理并重建缓存

```bash
yum clean all        # 清理旧缓存
yum makecache        # 生成新缓存
```

::: tip yum makecache 的作用
`yum makecache` 会把所有软件包的元数据下载到本地。之后的 `yum install` 会先查本地缓存，速度更快。
:::

## 常用软件安装

```bash
# 网络工具
yum install -y net-tools      # ifconfig、netstat
yum install -y wget           # 下载工具
yum install -y curl           # HTTP 客户端

# 编辑器
yum install -y vim            # 增强版 vi

# 解压工具
yum install -y unzip zip      # zip 解压

# 开发工具
yum install -y gcc            # C 编译器
yum install -y make           # 构建工具
yum install -y pcre-devel     # PCRE 开发库
yum install -y zlib-devel     # zlib 开发库
```

## RPM 包管理

YUM 底层调用的是 RPM。有时需要直接操作 RPM：

```bash
# 查询已安装的 RPM 包
rpm -qa | grep nginx

# 查看包信息
rpm -qi nginx

# 查看包安装了哪些文件
rpm -ql nginx

# 强制安装（不检查依赖）
rpm -ivh --nodeps package.rpm

# 卸载 RPM 包
rpm -e nginx
```

## YUM 缓存管理

```bash
# 查看缓存目录
ls /var/cache/yum/

# 清理所有缓存
yum clean all

# 清理指定缓存
yum clean packages       # 清理下载的 RPM 包
yum clean metadata       # 清理元数据

# 保留下载的 RPM 包（默认安装后删除）
# 编辑 /etc/yum.conf
# 修改 cachedir 和 keepcache=1
```

## 软件包组管理

```bash
# 查看可用的包组
yum grouplist

# 安装包组
yum groupinstall -y "Development Tools"

# 查看包组包含的软件
yum groupinfo "Development Tools"
```

## 常见问题

### 1. 安装时报 "No package xxx available"

```bash
# 搜索确认包名
yum search xxx

# 检查源是否正确
yum repolist

# 重建缓存
yum clean all && yum makecache
```

### 2. 依赖冲突

```bash
# 跳过依赖安装（危险，不推荐）
rpm -ivh --nodeps package.rpm

# 用 YUM 的 --skip-broken
yum install -y xxx --skip-broken
```

### 3. 网络不通

```bash
# 检查网络
ping mirrors.aliyun.com

# 检查 DNS
cat /etc/resolv.conf

# 检查网卡状态
ip addr
```

## 总结

| 命令 | 作用 |
|------|------|
| `yum install -y xxx` | 安装软件 |
| `yum remove -y xxx` | 卸载软件 |
| `yum update -y` | 更新软件 |
| `yum search xxx` | 搜索软件 |
| `yum clean all` | 清理缓存 |
| `yum makecache` | 重建缓存 |
| `yum list installed` | 查看已安装 |

**下一篇**：VIM 编辑器——Linux 下最强大的文本编辑器。
