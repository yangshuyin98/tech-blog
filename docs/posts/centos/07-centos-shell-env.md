---
title: '[07] Shell 环境：环境变量、管道符与重定向'
category: centos
tags: ['CentOS', 'Shell', '环境变量', '管道']
date: 2026-03-16
readTime: '13 min'
order: 7
---

## Shell 是什么？

Shell 是用户和 Linux 内核之间的**翻译官**。你输入命令，Shell 解释并执行。

常见的 Shell：
- **bash** — 最常用，CentOS 默认
- **sh** — Bourne Shell，bash 的前身
- **zsh** — 功能更强，Mac 默认
- **fish** — 用户友好，自动补全

```bash
# 查看当前 Shell
echo $SHELL
# /bin/bash

# 查看所有可用 Shell
cat /etc/shells
```

## 环境变量

环境变量是系统和程序的**配置参数**。

### 查看环境变量

```bash
# 查看所有环境变量
env

# 查看单个变量
echo $PATH
echo $HOME
echo $USER
echo $SHELL

# PATH 是最重要的：命令搜索路径
echo $PATH
# /usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/root/bin
```

### 为什么命令不需要写全路径？

```bash
ls           # 不用写 /usr/bin/ls
nginx        # 不用写 /usr/local/nginx/sbin/nginx
```

因为 Shell 会去 `$PATH` 目录里找命令。找不到就会报 "command not found"。

### 设置环境变量

```bash
# 临时设置（当前终端有效）
export MY_VAR="hello"
echo $MY_VAR

# 永久设置（添加到配置文件）
echo 'export MY_VAR="hello"' >> ~/.bashrc
source ~/.bashrc    # 立即生效
```

### PATH 变量操作

```bash
# 追加目录到 PATH（临时）
export PATH=$PATH:/usr/local/nginx/sbin

# 永久追加
echo 'export PATH=$PATH:/usr/local/nginx/sbin' >> ~/.bashrc
source ~/.bashrc
```

### 常用环境变量

| 变量 | 含义 |
|------|------|
| `PATH` | 命令搜索路径 |
| `HOME` | 当前用户家目录 |
| `USER` | 当前用户名 |
| `SHELL` | 当前 Shell |
| `LANG` | 系统语言 |
| `PS1` | 命令提示符格式 |
| `PWD` | 当前工作目录 |

### 自定义提示符 PS1

```bash
# 查看当前提示符
echo $PS1
# [\u@\h \W]\$

# 修改提示符（临时）
export PS1='[\u@\h \w]\$'

# 说明
# \u = 用户名
# \h = 主机名
# \w = 完整路径
# \W = 当前目录名
# \$ = 提示符（root为#，普通用户为$）
```

## 管道符 |

管道符把**前一个命令的输出**作为**后一个命令的输入**。

```bash
# 列出文件，只显示包含 "conf" 的行
ls -l /etc/ | grep conf

# 查看进程，只看 nginx
ps -ef | grep nginx

# 统计 /etc 下有多少个文件
ls -l /etc/ | wc -l

# 查看磁盘使用，按使用率排序
df -h | sort -k5 -rn

# 分页显示
cat /var/log/messages | less

# 多级管道
cat /etc/passwd | grep bash | wc -l
# 统计有几个可以登录的用户
```

## 重定向

重定向改变命令的输入/输出方向。

### 标准输出重定向

```bash
# 覆盖写入
echo "hello" > file.txt

# 追加写入
echo "world" >> file.txt

# 把 ls 结果写入文件
ls -l /etc/ > etc_list.txt

# 合并多个命令输出
(date; ls -l) > report.txt
```

### 标准错误重定向

```bash
# 错误输出写入文件
ls /notexist 2> error.log

# 正确和错误都写入文件
command > all.log 2>&1
# 或
command &> all.log

# 丢弃错误输出
command 2>/dev/null
```

### 输入重定向

```bash
# 从文件读取输入
sort < unsorted.txt

# 统计文件行数
wc -l < file.txt
```

### 空设备 /dev/null

```bash
# 丢弃所有输出
command > /dev/null 2>&1

# 常见用法：后台静默执行
nohup ./start.sh > /dev/null 2>&1 &
```

## 命令连接符

```bash
# ; 顺序执行（不管前一个成功与否）
cmd1; cmd2; cmd3

# && 前一个成功才执行后一个
make && make install

# || 前一个失败才执行后一个
cd /notexist || echo "目录不存在"

# 组合
./configure && make && make install || echo "安装失败"
```

## 常用快捷键

| 快捷键 | 作用 |
|--------|------|
| `Tab` | 命令/路径自动补全 |
| `Tab Tab` | 显示所有候选 |
| `Ctrl+C` | 终止当前命令 |
| `Ctrl+Z` | 暂停当前命令 |
| `Ctrl+L` | 清屏 |
| `Ctrl+A` | 光标到行首 |
| `Ctrl+E` | 光标到行尾 |
| `Ctrl+U` | 删除光标前所有字符 |
| `Ctrl+K` | 删除光标后所有字符 |
| `Ctrl+R` | 搜索历史命令 |

## 总结

| 功能 | 语法 |
|------|------|
| 查看变量 | `echo $VAR` |
| 设置变量 | `export VAR=val` |
| 永久设置 | 写入 `~/.bashrc` + `source` |
| 管道 | `cmd1 | cmd2` |
| 输出重定向 | `cmd > file`（覆盖）/ `cmd >> file`（追加） |
| 错误重定向 | `cmd 2> file` |
| 丢弃输出 | `cmd > /dev/null 2>&1` |

**下一篇**：进程管理——ps、top、kill、systemd 服务管理。
