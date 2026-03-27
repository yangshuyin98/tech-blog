---
title: '[04] Vue 生命周期钩子：从创建到销毁的完整流程'
category: vue
tags: ['Vue', '生命周期', '钩子函数']
date: 2026-03-17
readTime: '15 min'
order: 4
---

## 什么是生命周期？

一个 Vue 组件从**创建**到**销毁**的整个过程，称为生命周期。

```
创建 → 挂载 → 更新 → 销毁
  ↓      ↓      ↓      ↓
beforeCreate  beforeMount  beforeUpdate  beforeDestroy
created       mounted      updated       destroyed
```

每个阶段 Vue 都提供了**钩子函数**，让你在特定时机执行自定义逻辑。

## 生命周期流程图

```
new Vue()
    │
    ▼
beforeCreate    ← 实例创建前，data/methods 还不可用
    │
    ▼
created         ← 实例创建完成，data/methods 可用，DOM 还没挂载
    │
    ▼
beforeMount     ← 模板编译完成，即将挂载到 DOM
    │
    ▼
mounted         ← DOM 挂载完成，可以操作 DOM 了 ✅
    │
    ▼
  （数据变化）
    │
    ▼
beforeUpdate    ← 数据变了，DOM 即将更新
    │
    ▼
updated         ← DOM 更新完成 ✅
    │
    ▼
beforeDestroy   ← 即将销毁，定时器/事件监听在这里清理
    │
    ▼
destroyed       ← 销毁完成，所有事件监听器移除
```

## 钩子函数详解

### beforeCreate

```javascript
export default {
  beforeCreate() {
    console.log('beforeCreate')
    console.log(this.data)      // ❌ undefined
    console.log(this.$el)       // ❌ undefined
  }
}
```

**状态**：实例刚创建，`data`、`methods`、`computed` 都还没初始化。

**用途**：几乎不用。少数场景用于插件初始化。

### created ⭐ 常用

```javascript
export default {
  created() {
    console.log('created')
    console.log(this.message)   // ✅ 可以访问 data
    console.log(this.$el)       // ❌ 还是 undefined（DOM 未挂载）

    // 常见用法：发起初始数据请求
    this.fetchData()
  },
  methods: {
    async fetchData() {
      const res = await fetch('/api/users')
      this.users = await res.json()
    }
  }
}
```

**状态**：实例创建完成，`data`、`methods` 可用，但 DOM 还没挂载。

**用途**：
- 发起初始数据请求
- 初始化非 DOM 相关的操作
- 订阅事件

### beforeMount

```javascript
export default {
  beforeMount() {
    console.log('beforeMount')
    console.log(this.$el)       // 有值，但还没替换模板
  }
}
```

**状态**：模板编译完成，即将挂载到 DOM。

**用途**：很少用，一般在 `created` 或 `mounted` 中操作。

### mounted ⭐⭐ 最常用

```javascript
export default {
  mounted() {
    console.log('mounted')
    console.log(this.$el)       // ✅ DOM 已挂载

    // 常见用法
    this.initChart()            // 初始化图表
    this.$refs.input.focus()    // 聚焦输入框
    this.addEventListeners()    // 添加全局事件监听
  }
}
```

**状态**：DOM 挂载完成，可以安全操作 DOM。

**用途**：
- 操作 DOM（聚焦、获取尺寸、初始化第三方库）
- 发起需要 DOM 就绪的请求
- 添加定时器、事件监听

::: tip created vs mounted
- **created**：数据准备好了，DOM 还没好 → 适合发请求
- **mounted**：DOM 也好了 → 适合操作 DOM
:::

### beforeUpdate

```javascript
export default {
  beforeUpdate() {
    console.log('beforeUpdate')
    console.log('数据变了，DOM 还没更新')
  }
}
```

**状态**：数据已变化，DOM 即将更新。

**用途**：在更新前访问现有 DOM（比如保存滚动位置）。

### updated

```javascript
export default {
  updated() {
    console.log('updated')
    console.log('DOM 已更新')

    // 注意：不要在这里修改数据，可能导致死循环
  }
}
```

**状态**：DOM 更新完成。

**用途**：
- 操作更新后的 DOM
- 与第三方库同步状态

::: warning 避免死循环
在 `updated` 中修改数据会触发再次更新，导致无限循环。如果需要根据数据变化做操作，用 `watch` 而不是 `updated`。
:::

### beforeDestroy ⭐ 常用

```javascript
export default {
  data() {
    return {
      timer: null
    }
  },
  mounted() {
    this.timer = setInterval(() => {
      this.count++
    }, 1000)
  },
  beforeDestroy() {
    // 清理工作：防止内存泄漏
    clearInterval(this.timer)
    window.removeEventListener('resize', this.handleResize)
    this.socket.disconnect()
  }
}
```

**状态**：组件即将被销毁。

**用途**：
- **清除定时器**（最常见的内存泄漏原因）
- 移除事件监听
- 断开 WebSocket 连接
- 取消未完成的请求

### destroyed

```javascript
export default {
  destroyed() {
    console.log('组件已销毁')
    // 所有事件监听已移除，子组件已销毁
  }
}
```

**状态**：组件销毁完成。

## 完整生命周期示例

```vue
<template>
  <div ref="container">
    <p>计数：{{ count }}</p>
    <button @click="count++">+1</button>
  </div>
</template>

<script>
export default {
  data() {
    return { count: 0, timer: null }
  },

  beforeCreate() {
    console.log('1. beforeCreate - 实例初始化')
  },

  created() {
    console.log('2. created - data/methods 可用')
    this.timer = setInterval(() => {
      console.log('定时器运行中...')
    }, 3000)
  },

  beforeMount() {
    console.log('3. beforeMount - 即将挂载')
  },

  mounted() {
    console.log('4. mounted - DOM 挂载完成')
    console.log('容器宽度：', this.$refs.container.offsetWidth)
  },

  beforeUpdate() {
    console.log('5. beforeUpdate - 数据变了，DOM 待更新')
  },

  updated() {
    console.log('6. updated - DOM 已更新')
  },

  beforeDestroy() {
    console.log('7. beforeDestroy - 清理资源')
    clearInterval(this.timer)
  },

  destroyed() {
    console.log('8. destroyed - 组件已销毁')
  }
}
</script>
```

点击按钮后的输出：

```
5. beforeUpdate - 数据变了，DOM 待更新
6. updated - DOM 已更新
```

## 钩子函数速查表

| 钩子 | 时机 | data | DOM | 典型用途 |
|------|------|------|-----|---------|
| `beforeCreate` | 实例初始化 | ❌ | ❌ | 插件初始化 |
| `created` | 实例创建完成 | ✅ | ❌ | 发请求、初始化数据 |
| `beforeMount` | 模板编译完成 | ✅ | ❌ | 很少用 |
| `mounted` | DOM 挂载完成 | ✅ | ✅ | 操作 DOM、初始化第三方库 |
| `beforeUpdate` | 数据变了 | ✅ | 旧 | 保存滚动位置等 |
| `updated` | DOM 更新完成 | ✅ | 新 | 同步第三方库状态 |
| `beforeDestroy` | 即将销毁 | ✅ | ✅ | 清理定时器/监听器 |
| `destroyed` | 销毁完成 | ✅ | ❌ | 最终清理 |

## 常见面试题

### created 和 mounted 的区别？

- **created**：data 和 methods 准备好了，DOM 还没挂载。适合发请求。
- **mounted**：DOM 已挂载。适合操作 DOM。

### 什么时候用 beforeDestroy？

组件销毁前需要清理的资源都在这里处理：
- `setInterval` / `setTimeout`
- `addEventListener` 添加的事件
- WebSocket 连接
- 第三方库实例（图表、地图等）

## 总结

理解生命周期就是在对的时机做对的事：
- **拿数据** → `created`
- **操作 DOM** → `mounted`
- **清理资源** → `beforeDestroy`

**下一篇**：Vue CLI 工程化——从零搭建 Vue 项目，目录结构和运行流程。
