---
title: '[08] 进程管理：ps、top、kill 与 systemd 服务'
category: centos
tags: ['CentOS', '进程', 'systemd', 'systemctl']
date: 2026-03-17
readTime: '14 min'
order: 8
---

## 进程是什么？

进程就是**正在运行的程序**。每个进程有唯一的 PID（进程号）。

```bash
# 查看进程
ps -ef
```

```
UID        PID  PPID  C STIME TTY          TIME CMD
root         1     0  0 10:00 ?        00:00:01 /usr/lib/systemd/systemd
root       892     1  0 10:00 ?        00:00:00 /usr/sbin/sshd -D
root      1234   892  0 10:05 ?        00:00:00 sshd: root@pts/0
```

| 字段 | 含义 |
|------|------|
| `UID` | 所属用户 |
| `PID` | 进程号 |
| `PPID` | 父进程号 |
| `CMD` | 启动命令 |

## ps 查看进程

```bash
# 查看所有进程（完整格式）
ps -ef

# 查看所有进程（BSD 风格，更直观）
ps aux

# 过滤特定进程
ps -ef | grep nginx
ps aux | grep mysql

# 查看进程树
ps -ef --forest

# 查看指定用户的进程
ps -u root
```

### ps aux 各列含义

```
USER  PID  %CPU  %MEM  VSZ   RSS  TTY  STAT  START  TIME  COMMAND
root  1    0.0   0.1   12800 7680 ?    Ss   10:00  0:01  systemd
```

| 列 | 含义 |
|----|------|
| `%CPU` | CPU 使用率 |
| `%MEM` | 内存使用率 |
| `VSZ` | 虚拟内存大小 |
| `RSS` | 实际物理内存 |
| `STAT` | 进程状态（S=休眠 R=运行 Z=僵尸） |

## top 实时监控

```bash
top
```

```
top - 10:30:00 up 2 days, load average: 0.05, 0.10, 0.08
Tasks: 120 total, 1 running, 119 sleeping, 0 stopped, 0 zombie
%Cpu(s): 2.3 us, 1.0 sy, 0.0 ni, 96.7 id, 0.0 wa, 0.0 hi, 0.0 si
MiB Mem: 3840.0 total, 2048.0 free, 1024.0 used, 768.0 buff/cache

  PID USER  PR  NI  VIRT  RES  SHR S %CPU %MEM  TIME+ COMMAND
 1234 root  20   0  500m  200m  50m S  5.0  5.2  0:30 nginx
```

### top 交互命令

| 按键 | 作用 |
|------|------|
| `P` | 按 CPU 排序 |
| `M` | 按内存排序 |
| `T` | 按时间排序 |
| `k` | 杀死进程（输入 PID） |
| `q` | 退出 |
| `1` | 显示每个 CPU 核心 |
| `h` | 帮助 |

### 常用组合

```bash
# 只看前 10 个进程
top -bn1 | head -15

# 按内存排序
top -o %MEM

# 指定刷新间隔（3秒）
top -d 3
```

## kill 终止进程

```bash
# 正常终止（发送 SIGTERM）
kill 1234

# 强制终止（发送 SIGKILL）
kill -9 1234

# 按名称终止
killall nginx
killall python

# 按名称强制终止
pkill -9 nginx

# 按条件终止
pkill -u zhangsan        # 终止某用户所有进程
pkill -f "python app.py" # 终止匹配命令行的进程
```

### 信号类型

| 信号 | 编号 | 说明 |
|------|------|------|
| `SIGTERM` | 15 | 正常终止（默认），允许进程清理 |
| `SIGKILL` | 9 | 强制终止，进程无法捕获 |
| `SIGHUP` | 1 | 挂起，常用于重载配置 |
| `SIGINT` | 2 | 中断（同 Ctrl+C） |

::: tip 先试 kill，再用 kill -9
先发 `kill PID`（SIGTERM），给进程清理的机会。如果进程不响应，再用 `kill -9 PID`（SIGKILL）强制杀死。
:::

## 后台运行

```bash
# 命令末尾加 & 后台运行
./start.sh &

# 查看后台任务
jobs

# 暂停当前命令（前台转后台）
Ctrl+Z

# 恢复后台任务
bg %1        # 后台运行
fg %1        # 前台运行

# nohup：退出终端后继续运行
nohup ./start.sh > output.log 2>&1 &
```

## systemd 服务管理

CentOS 7+ 使用 systemd 管理服务（替代了旧的 service 命令）。

### systemctl 呺令

```bash
# 启动/停止/重启服务
systemctl start nginx
systemctl stop nginx
systemctl restart nginx

# 查看服务状态
systemctl status nginx

# 开机自启/取消自启
systemctl enable nginx
systemctl disable nginx

# 查看是否开机自启
systemctl is-enabled nginx

# 重载配置（不重启服务）
systemctl reload nginx

# 查看所有已启动的服务
systemctl list-units --type=service --state=running

# 查看所有服务
systemctl list-unit-files --type=service
```

### service 命令（兼容旧写法）

```bash
service nginx start      # 等价于 systemctl start nginx
service nginx stop
service nginx restart
service nginx status
```

## crontab 定时任务

```bash
# 编辑定时任务
crontab -e

# 查看定时任务
crontab -l

# 删除所有定时任务
crontab -r
```

### cron 表达式格式

```
* * * * * command
│ │ │ │ │
│ │ │ │ └── 星期（0-7，0和7都是周日）
│ │ │ └──── 月份（1-12）
│ │ └────── 日期（1-31）
│ └──────── 小时（0-23）
└────────── 分钟（0-59）
```

### 示例

```bash
# 每天凌晨 3 点执行备份脚本
0 3 * * * /opt/backup.sh

# 每 5 分钟执行一次
*/5 * * * * /opt/check.sh

# 每周一早上 9 点
0 9 * * 1 /opt/report.sh

# 每月 1 号凌晨 0 点
0 0 1 * * /opt/monthly.sh
```

## 总结

| 命令 | 作用 |
|------|------|
| `ps -ef` | 查看所有进程 |
| `top` | 实时监控 |
| `kill PID` | 终止进程 |
| `kill -9 PID` | 强制终止 |
| `nohup cmd &` | 后台运行 |
| `systemctl start/stop/restart` | 服务管理 |
| `systemctl enable/disable` | 开机自启 |
| `crontab -e` | 定时任务 |

**下一篇**：网络管理——IP 配置、防火墙、端口查看。
