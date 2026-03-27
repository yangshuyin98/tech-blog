---
title: '[01] CentOS 入门：Linux 基础与虚拟机安装'
category: centos
tags: ['CentOS', 'Linux', '入门', '虚拟机']
date: 2026-03-10
readTime: '15 min'
order: 1
---

## 为什么学 Linux？

Windows 日常办公没问题，但做服务器就不行了：

| 对比 | Linux | Windows |
|------|-------|---------|
| 性能 | 无图形界面，资源全给业务 | 图形界面吃掉大量资源 |
| 稳定性 | 可以几年不重启 | 定期要重启 |
| 安全性 | 开源，漏洞修复快 | 闭源，补丁依赖微软 |
| 远程管理 | SSH 命令行，低带宽 | 远程桌面，吃带宽 |
| 服务器市场 | 占比 90%+ | 占比不到 10% |

**一句话**：服务器领域，Linux 是绝对主力。

## Linux 发展简史

```
1969 Unix（贝尔实验室）
    ↓
1983 GNU 计划（Stallman 发起，Emacs、GCC）
    ↓
1991 Linux 0.01（Linus Torvalds 发布内核）
    ↓
1992 GNU + Linux 合并 → GNU/Linux
    ↓
1994 Red Hat Linux 发布
    ↓
2003 CentOS 诞生（Red Hat 社区版）
```

## 常见 Linux 发行版

| 发行版 | 特点 | 适用场景 |
|--------|------|---------|
| **CentOS** | 稳定、免费、企业级 | 服务器（主流） |
| **Ubuntu** | 界面友好、社区活跃 | 桌面/服务器 |
| **Red Hat** | 商业支持、收费 | 企业生产环境 |
| **Debian** | 极其稳定、软件包全 | 服务器 |
| **SUSE** | 欧洲流行 | 企业服务器 |

::: tip CentOS 的特殊地位
CentOS 是 Red Hat Enterprise Linux (RHEL) 的社区重编译版，功能完全一致但**免费**。国内互联网公司大量使用 CentOS。
:::

## 安装虚拟机

### 准备工作

1. 下载 VMware Workstation（虚拟机软件）
2. 下载 CentOS ISO 镜像（推荐 CentOS 7）

### 创建虚拟机

```
VMware → 新建虚拟机 → 典型 → 稍后安装操作系统
→ 选 Linux / CentOS 7 64 位
→ 设置虚拟机名称和位置
→ 磁盘大小 20GB（够学习用）
→ 完成
```

### 安装 CentOS

```
编辑虚拟机设置 → CD/DVD → 选 ISO 镜像
→ 开启虚拟机 → Install CentOS 7
→ 选语言（中文）→ 安装位置（自动分区）
→ 设置 root 密码 → 等待安装完成 → 重启
```

## 虚拟机网络模式

VMware 提供三种网络模式：

| 模式 | 特点 | 适用场景 |
|------|------|---------|
| **NAT** | 虚拟机共享主机 IP 上网 | 学习用（推荐） |
| **桥接** | 虚拟机获得独立 IP，局域网可访问 | 服务器部署 |
| **仅主机** | 只能和主机通信 | 隔离测试 |

### 配置静态 IP（NAT 模式）

```bash
# 编辑网卡配置文件
vim /etc/sysconfig/network-scripts/ifcfg-ens33
```

```ini
BOOTPROTO=static        # 静态IP模式
IPADDR=172.18.15.218    # 指定IP地址
NETMASK=255.255.255.0   # 子网掩码
GATEWAY=172.18.15.254   # 网关
DNS1=172.18.6.6         # DNS服务器
DNS2=10.1.0.3
ONBOOT=yes              # 开机自启网卡
```

```bash
# 重启网络
service network restart

# 验证
ip addr
ping www.baidu.com
```

## SSH 远程连接

SSH 是 Linux 远程管理的标准方式，几乎不消耗带宽。

```bash
# 从 Windows/Mac 连接 Linux
ssh root@172.18.15.128

# 指定用户连接
ssh XNY5612@172.18.15.128

# 文件传输
sftp root@172.18.15.128
```

::: tip 推荐工具
- Windows：Xshell、PuTTY、Windows Terminal
- Mac：自带终端
- 文件传输：FileZilla、WinSCP
:::

## Linux 目录结构

```
/                    ← 根目录
├── bin/             ← 基本命令（ls、cp、mv）
├── sbin/            ← 系统管理命令（fdisk、reboot）
├── etc/             ← 配置文件
├── home/            ← 普通用户家目录
├── root/            ← root 用户家目录
├── usr/             ← 用户程序（类似 Program Files）
│   ├── local/       ← 手动安装的软件
│   └── bin/         ← 用户命令
├── var/             ← 变量数据（日志、缓存）
├── tmp/             ← 临时文件
├── dev/             ← 设备文件
├── proc/            ← 进程信息（虚拟文件系统）
└── media/           ← 挂载点（光盘、U盘）
```

## 基础命令速查

```bash
# 目录操作
pwd                  # 当前目录
ls                   # 列出文件
ls -l                # 详细列表
cd /usr/local        # 切换目录
mkdir -p a/b/c       # 递归创建目录

# 文件操作
touch file.txt       # 创建空文件
cp file1 file2       # 复制
mv file1 file2       # 移动/重命名
rm -rf dir/          # 删除（危险！）

# 查看内容
cat file.txt         # 显示全部内容
head -10 file.txt    # 前10行
tail -10 file.txt    # 后10行
tail -f /var/log/messages  # 实时跟踪日志
```

## 总结

- Linux 是服务器的绝对主力，运维必学
- CentOS 是最主流的服务器发行版之一
- 虚拟机安装学习不影响本机
- SSH 是远程管理的标准方式
- 静态 IP 配置：编辑 `ifcfg-ens33`，设置 `BOOTPROTO=static`

**下一篇**：YUM 包管理——安装、卸载、换源、缓存管理。
