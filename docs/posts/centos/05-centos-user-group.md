---
title: '[05] 用户与用户组管理：创建、删除、sudo 权限'
category: centos
tags: ['CentOS', '用户管理', '用户组', 'sudo']
date: 2026-03-14
readTime: '12 min'
order: 5
---

## 用户与用户组

Linux 是**多用户操作系统**，多个用户可以同时登录并使用系统。

- **用户（User）**：每个用户有独立的家目录、权限、环境
- **用户组（Group）**：把多个用户归到一组，方便统一管理权限

```
root（超级管理员）
├── 组：wheel（管理组）
│   ├── zhangsan
│   └── lisi
├── 组：devops（运维组）
│   └── wangwu
└── 组：developers（开发组）
    └── zhaoliu
```

## 用户管理

### 添加用户

```bash
# 创建用户（自动创建同名家目录）
useradd zhangsan

# 指定参数创建
useradd -u 1005 -g devops -d /home/zhangsan -s /bin/bash zhangsan

# 参数说明
# -u    指定 UID
# -g    指定主组
# -G    指定附加组
# -d    指定家目录
# -s    指定 shell
```

### 设置密码

```bash
passwd zhangsan
# 输入两次密码

# 非交互式设置密码
echo "123456" | passwd --stdin zhangsan
```

### 查看用户信息

```bash
id zhangsan
# uid=1001(zhangsan) gid=1001(zhangsan) groups=1001(zhangsan)

cat /etc/passwd | grep zhangsan
# zhangsan:x:1001:1001::/home/zhangsan:/bin/bash
# 用户名:密码占位:UID:GID:描述:家目录:Shell
```

### 修改用户

```bash
# 修改用户名
usermod -l newname oldname

# 修改附加组（加入 sudo 组）
usermod -G wheel zhangsan

# 修改 shell
usermod -s /sbin/nologin zhangsan  # 禁止登录

# 锁定用户
usermod -L zhangsan

# 解锁用户
usermod -U zhangsan
```

### 删除用户

```bash
userdel zhangsan          # 删除用户（保留家目录）
userdel -r zhangsan       # 删除用户和家目录
```

## 用户组管理

```bash
# 创建用户组
groupadd devops

# 创建组并指定 GID
groupadd -g 1010 developers

# 修改组名
groupmod -n newgroup oldgroup

# 修改 GID
groupmod -g 1020 developers

# 删除组（组内不能有用户）
groupdel devops

# 查看所有组
cat /etc/group
tail -5 /etc/group
```

### 将用户加入组

```bash
# 创建时指定组
useradd -G devops zhangsan

# 后期添加到附加组
usermod -G devops lisi

# 追加组（不影响其他附加组）
usermod -aG developers lisi
```

## 切换用户

```bash
# 切换到其他用户
su - zhangsan
# 输入密码

# 切换到 root
su -
# 输入 root 密码

# 退出当前用户
exit
# 或 Ctrl+D
```

## sudo 权限

普通用户默认不能执行管理命令。通过 `sudo` 授权：

### 配置 sudo

```bash
# 编辑 sudoers 文件（必须用 visudo）
visudo
# 实际编辑 /etc/sudoers
```

```ini
# 授权 zhangsan 执行所有命令
zhangsan    ALL=(ALL)       ALL

# 授权 devops 组执行所有命令
%devops     ALL=(ALL)       ALL

# 授权 lisi 免密执行所有命令
lisi        ALL=(ALL)       NOPASSWD: ALL

# 授权特定命令
wangwu      ALL=(ALL)       /usr/bin/systemctl restart nginx
```

### 使用 sudo

```bash
# 用 sudo 执行管理命令
sudo systemctl restart nginx
sudo yum install -y vim
sudo vim /etc/nginx/nginx.conf

# 查看自己的 sudo 权限
sudo -l
```

## 相关文件

| 文件 | 内容 |
|------|------|
| `/etc/passwd` | 用户信息（用户名、UID、GID、家目录、Shell） |
| `/etc/shadow` | 密码信息（加密存储） |
| `/etc/group` | 用户组信息 |
| `/etc/gshadow` | 组密码信息 |
| `/etc/sudoers` | sudo 权限配置 |

## 实战：创建运维用户

```bash
# 1. 创建运维组
groupadd devops

# 2. 创建用户，加入运维组
useradd -G devops -s /bin/bash ops01
passwd ops01

# 3. 配置 sudo 权限
visudo
# 添加：ops01  ALL=(ALL)  ALL

# 4. 测试
su - ops01
sudo cat /etc/shadow   # 应该能看到内容
```

## 总结

| 命令 | 作用 |
|------|------|
| `useradd username` | 创建用户 |
| `passwd username` | 设置密码 |
| `usermod -G group user` | 添加到组 |
| `userdel -r username` | 删除用户 |
| `groupadd groupname` | 创建组 |
| `su - username` | 切换用户 |
| `visudo` | 配置 sudo 权限 |

**下一篇**：文件权限——读写执行、chmod、chown、SELinux。
