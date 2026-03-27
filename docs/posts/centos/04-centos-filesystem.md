---
title: '[04] Linux 文件系统：目录结构与文件操作'
category: centos
tags: ['CentOS', '文件系统', '目录']
date: 2026-03-13
readTime: '13 min'
order: 4
---

## 一切皆文件

Linux 的核心哲学：**一切皆文件**。目录、设备、进程、网络连接，在 Linux 中都被抽象为文件。

## 目录结构

```
/                          ← 根目录（所有目录的起点）
├── bin/                   ← 基本命令（ls、cp、mv、cat）
├── sbin/                  ← 系统管理命令（fdisk、reboot、iptables）
├── boot/                  ← 启动文件（内核、引导程序）
├── dev/                   ← 设备文件（硬盘、USB、显示器）
├── etc/                   ← 配置文件 ⭐
│   ├── sysconfig/         ← 系统配置
│   ├── yum.repos.d/       ← YUM 源配置
│   └── passwd             ← 用户信息
├── home/                  ← 普通用户家目录
│   ├── zhangsan/
│   └── lisi/
├── root/                  ← root 用户家目录
├── lib/ /lib64/           ← 系统库文件
├── media/                 ← 自动挂载点（光盘、U盘）
├── mnt/                   ← 手动挂载点
├── opt/                   ← 第三方大型软件
├── proc/                  ← 进程信息（虚拟文件系统）⭐
├── tmp/                   ← 临时文件（重启清空）
├── usr/                   ← 用户程序 ⭐
│   ├── bin/               ← 用户命令
│   ├── sbin/              ← 用户管理命令
│   ├── local/             ← 手动安装的软件
│   │   ├── nginx/         ← Nginx 安装位置
│   │   └── src/           ← 源码编译位置
│   └── share/             ← 共享数据
└── var/                   ← 变量数据 ⭐
    ├── log/               ← 系统日志
    ├── cache/             ← 缓存
    └── spool/             ← 队列数据（邮件、打印）
```

::: tip 重要目录
- `/etc` — 放配置文件，改配置就来这里找
- `/usr/local` — 手动编译安装的软件放这里
- `/var/log` — 日志文件，排查问题必看
- `/proc` — 虚拟文件系统，查看进程和系统信息
:::

## 文件操作命令

### 目录操作

```bash
pwd                        # 显示当前路径
cd /usr/local              # 切换目录
cd ~                       # 回家目录
cd -                       # 回上次目录
cd ..                      # 上级目录

mkdir test                 # 创建目录
mkdir -p a/b/c             # 递归创建（父目录不存在自动创建）
rmdir test                 # 删除空目录
rm -rf test/               # 递归删除（危险！）
```

### 文件操作

```bash
touch file.txt             # 创建空文件（已存在则更新时间）
cp file1 file2             # 复制文件
cp -r dir1/ dir2/          # 递归复制目录
mv file1 file2             # 移动/重命名
rm file.txt                # 删除文件
rm -f file.txt             # 强制删除（不提示）
```

### 查看文件内容

```bash
cat file.txt               # 显示全部内容
cat -n file.txt            # 带行号显示
head -20 file.txt          # 前20行
tail -20 file.txt          # 后20行
tail -f /var/log/messages  # 实时跟踪日志（调试神器）
more file.txt              # 分页显示（空格翻页，q退出）
less file.txt              # 分页显示（支持上下滚动）
```

### 查找文件

```bash
# find：按条件查找
find / -name "nginx.conf"           # 按文件名查找
find / -name "*.log"                # 通配符
find /var -type f -size +100M       # 查找大于100M的文件
find /tmp -mtime -7                 # 最近7天修改过的文件
find / -name "*.tmp" -exec rm {} \; # 查找并删除

# locate：快速查找（基于数据库）
locate nginx.conf
updatedb                           # 更新数据库

# which：查找命令位置
which nginx
which python
```

### 文件统计

```bash
wc -l file.txt             # 统计行数
wc -w file.txt             # 统计单词数
wc -c file.txt             # 统计字节数
du -sh /usr/local/         # 目录大小
df -h                      # 磁盘使用情况
```

## 文件链接

### 硬链接

```bash
ln source hard_link
```

- 多个文件名指向同一个 inode（数据块）
- 删除原文件不影响硬链接
- 不能跨文件系统
- 不能链接目录

### 软链接（符号链接）

```bash
ln -s /usr/local/nginx/sbin/nginx /usr/bin/nginx
```

- 类似 Windows 的快捷方式
- 删除原文件，软链接失效
- 可以跨文件系统
- 可以链接目录

```bash
# 常见用法：把命令链接到 PATH 目录
ln -s /usr/local/nginx/sbin/nginx /usr/bin/nginx
# 之后直接输入 nginx 就能运行
```

## 挂载（mount）

Linux 没有 C 盘 D 盘的概念，所有存储设备都挂载到 `/` 下的某个目录。

```bash
# 查看已挂载的设备
mount
df -h

# 挂载光盘到 /mnt
mount /dev/cdrom /mnt

# 查看光盘内容
ls /mnt/

# 卸载
umount /mnt

# 永久挂载：编辑 /etc/fstab
vim /etc/fstab
# 添加一行：
# /dev/cdrom  /mnt  iso9660  defaults  0 0
```

## 压缩与解压

```bash
# tar.gz（最常用）
tar -czvf archive.tar.gz dir/       # 压缩
tar -xzvf archive.tar.gz            # 解压
tar -xzvf archive.tar.gz -C /opt/   # 解压到指定目录

# zip
yum install -y zip unzip
zip -r archive.zip dir/             # 压缩
unzip archive.zip                   # 解压
unzip archive.zip -d /opt/          # 解压到指定目录

# 参数说明
# c = create（创建）
# x = extract（解压）
# z = gzip
# v = verbose（显示过程）
# f = file（指定文件名）
```

## 总结

| 目录 | 用途 |
|------|------|
| `/etc` | 配置文件 |
| `/usr/local` | 手动安装的软件 |
| `/var/log` | 系统日志 |
| `/home` | 普通用户家目录 |
| `/root` | root 家目录 |

| 命令 | 用途 |
|------|------|
| `find / -name "xxx"` | 查找文件 |
| `tail -f file` | 实时跟踪日志 |
| `du -sh dir/` | 目录大小 |
| `df -h` | 磁盘使用 |
| `ln -s src dst` | 创建软链接 |
| `tar -czvf` | 压缩 |
| `tar -xzvf` | 解压 |

**下一篇**：用户与用户组管理——创建用户、分配权限、sudo 配置。
