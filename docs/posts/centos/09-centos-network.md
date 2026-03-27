---
title: '[09] 网络管理：IP 配置、防火墙与端口管理'
category: centos
tags: ['CentOS', '网络', '防火墙', 'iptables']
date: 2026-03-18
readTime: '14 min'
order: 9
---

## 网络配置

### 查看网络信息

```bash
# 查看所有网络接口
ip addr

# 查看指定接口
ip addr show ens33

# 查看路由表
ip route

# 查看默认网关
ip route | grep default

# 旧版命令（已弃用但还有人用）
ifconfig                  # 安装：yum install -y net-tools
```

### 配置静态 IP

```bash
# 编辑网卡配置文件
vim /etc/sysconfig/network-scripts/ifcfg-ens33
```

```ini
TYPE=Ethernet
BOOTPROTO=static          # 静态IP（原来是 dhcp）
IPADDR=172.18.15.218      # IP地址
NETMASK=255.255.255.0     # 子网掩码
GATEWAY=172.18.15.254     # 网关
DNS1=172.18.6.6           # DNS
DNS2=10.1.0.3
ONBOOT=yes                # 开机自启
```

```bash
# 重启网络
systemctl restart NetworkManager
# 或
service network restart

# 验证
ip addr
ping www.baidu.com
```

### nmcli 命令行管理

```bash
# 查看网络连接
nmcli connection show

# 设置开机自启
nmcli connection modify ens33 connection.autoconnect yes

# 修改为静态 IP
nmcli connection modify ens33 ipv4.method manual ipv4.addresses 172.18.15.218/24

# 设置网关
nmcli connection modify ens33 ipv4.gateway 172.18.15.254

# 设置 DNS
nmcli connection modify ens33 ipv4.dns "172.18.6.6 10.1.0.3"

# 激活连接
nmcli connection up ens33

# 重启网络
systemctl restart NetworkManager
```

## 防火墙

### firewalld（CentOS 7 默认）

```bash
# 查看防火墙状态
systemctl status firewalld

# 启动/停止/重启
systemctl start firewalld
systemctl stop firewalld
systemctl restart firewalld

# 开机自启/取消
systemctl enable firewalld
systemctl disable firewalld

# 查看开放的端口
firewall-cmd --list-ports
firewall-cmd --list-all

# 开放端口（临时，重启失效）
firewall-cmd --add-port=80/tcp

# 开放端口（永久）
firewall-cmd --permanent --add-port=80/tcp
firewall-cmd --permanent --add-port=443/tcp
firewall-cmd --permanent --add-port=3306/tcp
firewall-cmd --reload    # 重新加载生效

# 关闭端口
firewall-cmd --permanent --remove-port=80/tcp
firewall-cmd --reload

# 开放服务
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --reload

# 关闭防火墙（测试环境）
systemctl stop firewalld
systemctl disable firewalld
```

### iptables（CentOS 6 / CentOS 7 也可用）

```bash
# 查看规则
iptables -L -n

# 查看规则（带行号，方便删除）
iptables -L -n --line-numbers

# 允许特定端口
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# 允许特定 IP 访问
iptables -A INPUT -s 192.168.1.100 -j ACCEPT

# 拒绝特定 IP
iptables -A INPUT -s 10.0.0.50 -j DROP

# 删除规则（按行号）
iptables -D INPUT 3

# 清空所有规则
iptables -F

# 保存规则
service iptables save
# 或
iptables-save > /etc/sysconfig/iptables
```

## 端口管理

```bash
# 查看所有监听端口
ss -tlnp
# 或
netstat -tlnp   # 需要 yum install -y net-tools

# 查看特定端口
ss -tlnp | grep 80

# 查看端口被哪个进程占用
ss -tlnp | grep :3306

# 查看所有连接
ss -anp
```

### ss 命令详解

```bash
# 参数说明
# -t  TCP 连接
# -u  UDP 连接
# -l  监听中的端口
# -n  不解析域名（显示 IP）
# -p  显示进程名
# -a  所有连接（包括非监听）

# 常用组合
ss -tlnp        # 查看 TCP 监听端口
ss -ulnp        # 查看 UDP 监听端口
ss -anp         # 查看所有连接
ss -s           # 连接统计摘要
```

## 网络诊断命令

```bash
# 基础连通性测试
ping -c 4 www.baidu.com     # 发送 4 个 ping 包

# 路由跟踪
traceroute www.baidu.com
# 或
traceroute -n 8.8.8.8

# DNS 查询
nslookup www.baidu.com
dig www.baidu.com           # 需要 yum install -y bind-utils

# 测试端口连通
curl -v http://localhost:80
telnet localhost 3306        # 需要 yum install -y telnet

# 下载文件
wget https://nginx.org/download/nginx-1.26.3.tar.gz
curl -O https://nginx.org/download/nginx-1.26.3.tar.gz
```

## Hostname 与 hosts

```bash
# 查看主机名
hostname
hostnamectl

# 修改主机名
hostnamectl set-hostname centos7-server

# 编辑 hosts 文件
vim /etc/hosts
# 添加：
# 192.168.1.100  myserver
```

## 总结

| 命令 | 作用 |
|------|------|
| `ip addr` | 查看 IP |
| `systemctl status firewalld` | 防火墙状态 |
| `firewall-cmd --permanent --add-port=80/tcp` | 开放端口 |
| `ss -tlnp` | 查看监听端口 |
| `ping` | 测试连通性 |
| `curl -v url` | 测试 HTTP 端口 |
| `nslookup domain` | DNS 查询 |

**下一篇**：Nginx 源码编译安装——从下载到配置到卸载。
