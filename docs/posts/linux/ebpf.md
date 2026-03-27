---
title: 'eBPF 入门：用可观测性重新理解 Linux 内核'
category: linux
tags: ['eBPF', '可观测性']
date: 2026-03-16
readTime: '18 min'
---

## eBPF 是什么？
eBPF（extended Berkeley Packet Filter）允许你在**不修改内核源码、不加载内核模块**的情况下，在内核中安全地运行自定义程序。

可以把 eBPF 理解为**内核的虚拟机**——你在用户态写代码，eBPF 验证器检查安全性，然后注入到内核执行。

## 为什么选择 eBPF？
传统观测手段的问题：

- **strace/ptrace** — 性能开销大，不适合生产环境
- **/proc 文件系统** — 信息有限，粒度不够
- **自定义埋点** — 需要修改应用代码，侵入性强

eBPF 提供了**零侵入**的观测能力——不需要重启进程、不需要修改代码、性能开销极小。

## bpftrace：快速上手
```bash
# 追踪所有 open 系统调用
sudo bpftrace -e 'tracepoint:syscalls:sys_enter_open { printf("%s %s\\n", comm, str(args->filename)); }'

# 统计进程的 syscall 次数
sudo bpftrace -e 'tracepoint:raw_syscalls:sys_enter { @[comm] = count(); }'

# 追踪 TCP 连接
sudo bpftrace -e 'kprobe:tcp_connect { printf("%s -> %s\\n", comm, ntop(args->sk->__sk_common.skc_daddr)); }'
```

## libbpf：生产级工具
bpftrace 适合快速排查，生产环境推荐使用 libbpf + CO-RE（Compile Once, Run Everywhere）：

```c
// 追踪进程 exec 事件
SEC("tracepoint/syscalls/sys_enter_execve")
int trace_execve(struct trace_event_raw_sys_enter *ctx) {
    struct event *e;
    e = ringbuf_reserve(&rb, sizeof(*e), 0);
    if (!e) return 0;

    bpf_get_current_comm(&e->comm, sizeof(e->comm));
    bpf_probe_read_user_str(&e->filename, sizeof(e->filename),
                            (void *)ctx->args[0]);

    ringbuf_submit(e, 0);
    return 0;
}
```

## 四大应用场景
| 场景 | 工具 | 用途 |
| --- | --- | --- |
| 网络包追踪 | tc / XDP | 高性能网络监控和过滤 |
| 调度延迟分析 | sched tracepoints | 定位进程调度瓶颈 |
| 文件访问审计 | fs tracepoints | 安全合规监控 |
| 函数耗时统计 | kprobe / uprobe | 性能热点分析 |

## 总结
eBPF 正在改变我们理解和操作 Linux 内核的方式。从 bpftrace 的快速排查到 libbpf 的生产部署，eBPF 为可观测性提供了前所未有的能力。
