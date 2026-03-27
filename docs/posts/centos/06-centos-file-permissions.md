---
title: '[06] 文件权限：chmod、chown 与 SELinux'
category: centos
tags: ['CentOS', '权限', 'chmod', 'chown', 'SELinux']
date: 2026-03-15
readTime: '14 min'
order: 6
---

## 权限三要素

Linux 每个文件都有三个权限归属：

```
-rw-r--r-- 1 root root 1024 Mar 15 10:00 file.txt
│  │  │     │ │    │
│  │  │     │ │    └── 所属组（group）
│  │  │     │ └─────── 所属用户（owner）
│  │  │     └───────── 链接数
│  │  └─── 其他人权限（other）
│  └────── 所属组权限（group）
└───────── 所属用户权限（user）
```

## 权限表示法

### 字母表示

```
r = read（读）     = 4
w = write（写）    = 2
x = execute（执行）= 1
- = 无权限         = 0
```

### 数字表示

| 数字 | 权限 | 含义 |
|------|------|------|
| 7 | `rwx` | 读+写+执行 |
| 6 | `rw-` | 读+写 |
| 5 | `r-x` | 读+执行 |
| 4 | `r--` | 只读 |
| 3 | `-wx` | 写+执行 |
| 2 | `-w-` | 只写 |
| 1 | `--x` | 只执行 |
| 0 | `---` | 无权限 |

## chmod 修改权限

### 数字方式

```bash
chmod 755 file.txt      # rwxr-xr-x（自己全权限，组和其他读+执行）
chmod 644 file.txt      # rw-r--r--（自己读写，其他人只读）
chmod 777 file.txt      # rwxrwxrwx（所有人全权限，危险！）
chmod 600 file.txt      # rw-------（只有自己能读写）
```

### 字母方式

```bash
# u=user, g=group, o=other, a=all
chmod u+x file.txt      # 给所属用户加执行权限
chmod g-w file.txt       # 所属组减写权限
chmod o+r file.txt       # 其他人加读权限
chmod +x file.txt        # 所有人加执行权限
chmod u+x,g+x,o+x file.txt  # 等价于 +x
chmod u-x,g-x,o-x file.txt  # 等价于 -x
```

### 递归修改

```bash
chmod -R 755 /usr/local/nginx/   # 递归修改目录下所有文件
```

## chown 修改所属

```bash
# 修改所属用户
chown zhangsan file.txt

# 修改所属用户和组
chown zhangsan:devops file.txt

# 递归修改
chown -R zhangsan:devops /usr/local/nginx/
```

```bash
# 修改所属组（单独命令）
chgrp devops file.txt
chgrp -R devops /data/
```

## 默认权限

新建文件和目录有默认权限：

```bash
# 查看默认权限掩码
umask
# 0022

# 文件默认权限 = 666 - umask = 644
# 目录默认权限 = 777 - umask = 755
```

修改 umask：

```bash
umask 002    # 临时修改
# 在 ~/.bashrc 中添加永久生效
echo 'umask 002' >> ~/.bashrc
```

## 特殊权限

### SUID（Set User ID）

执行文件时，以**文件所属用户**的身份执行：

```bash
# 典型例子：/usr/bin/passwd
ls -l /usr/bin/passwd
# -rwsr-xr-x 1 root root ... passwd
#          ↑ s 表示 SUID

# 设置 SUID
chmod u+s file
chmod 4755 file    # 4 开头
```

### SGID（Set Group ID）

```bash
chmod g+s dir/     # 目录下新建文件继承目录的组
chmod 2755 file
```

### Sticky Bit

```bash
chmod +t /tmp/     # 防止用户删除其他人的文件
chmod 1755 /tmp/
```

::: tip /tmp 目录
`/tmp` 默认有 Sticky Bit（`drwxrwxrwt`），任何人可以往里写文件，但只能删除自己的文件。
:::

## 权限实战

### 场景一：Web 服务器目录

```bash
# Nginx/Apache 以 www 用户运行
chown -R www:www /var/www/html/
chmod -R 755 /var/www/html/
chmod 644 /var/www/html/*.html
```

### 场景二：配置文件保护

```bash
# 敏感配置只有 root 可读写
chmod 600 /etc/my.cnf
chown root:root /etc/my.cnf
```

### 场景三：脚本执行

```bash
# 给脚本加执行权限
chmod +x deploy.sh
./deploy.sh
```

## SELinux

SELinux（Security-Enhanced Linux）是 Linux 内核的**强制访问控制**机制。

### 查看状态

```bash
sestatus
# SELinux status: enabled
# Current mode: enforcing
```

### 三种模式

| 模式 | 说明 |
|------|------|
| **enforcing** | 强制执行（默认，会拦截违规操作） |
| **permissive** | 宽容模式（只记录不拦截，用于调试） |
| **disabled** | 关闭 |

### 临时切换

```bash
setenforce 0    # 切换到 permissive
setenforce 1    # 切换到 enforcing
```

### 永久关闭

```bash
vim /etc/selinux/config
# 修改：SELINUX=disabled
# 重启生效
reboot
```

::: warning 生产环境建议
学习环境可以关闭 SELinux 简化操作。生产环境建议保持开启，通过 `audit2allow` 配置策略。
:::

## 总结

| 命令 | 作用 |
|------|------|
| `chmod 755 file` | 修改权限（数字方式） |
| `chmod u+x file` | 修改权限（字母方式） |
| `chown user:group file` | 修改所属 |
| `umask` | 查看默认权限掩码 |
| `sestatus` | 查看 SELinux 状态 |
| `setenforce 0` | 临时关闭 SELinux |

**下一篇**：Shell 环境——环境变量、管道符、重定向。
