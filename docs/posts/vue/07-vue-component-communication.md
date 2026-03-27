---
title: '[07] Vue 组件通信：Props、Events 与 Scoped 样式'
category: vue
tags: ['Vue', '组件通信', 'Props', 'Scoped']
date: 2026-03-20
readTime: '16 min'
order: 7
---

## 为什么需要组件通信？

组件的数据是**独立的**，无法直接访问另一个组件的数据。但实际开发中，组件之间经常需要传递数据：

```
父组件 App.vue
├── 子组件 Header.vue   ← 需要父组件的用户信息
├── 子组件 Main.vue
│   └── 孙组件 ProductCard.vue  ← 需要商品数据
└── 子组件 Footer.vue
```

## 组件关系分类

| 关系 | 通信方式 | 方向 |
|------|----------|------|
| 父 → 子 | **props** | 下行 |
| 子 → 父 | **$emit** | 上行 |
| 非父子 | **provide/inject** 或 EventBus | 跨层级 |

## 父传子：Props

### 基本用法

父组件通过**属性**传递数据给子组件：

```vue
<!-- 父组件 App.vue -->
<template>
  <HmHeader title="网站头部" :count="articleCount" />
</template>

<script>
import HmHeader from './components/HmHeader.vue'

export default {
  components: { HmHeader },
  data() {
    return {
      articleCount: 42
    }
  }
}
</script>
```

子组件通过 **props** 接收：

```vue
<!-- 子组件 HmHeader.vue -->
<template>
  <div class="header">
    <h1>{{ title }}</h1>
    <span>共 {{ count }} 篇文章</span>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true       // 必传
    },
    count: {
      type: Number,
      default: 0            // 默认值
    }
  }
}
</script>
```

### Props 类型校验

```javascript
props: {
  // 简单写法
  title: String,

  // 完整写法
  count: {
    type: Number,          // 类型
    required: true,        // 是否必传
    default: 0,            // 默认值
    validator(val) {       // 自定义校验
      return val >= 0
    }
  }
}
```

### ⚠️ 单向数据流

**Props 是只读的，子组件不能直接修改！**

```vue
<!-- ❌ 错误：直接修改 props -->
<script>
export default {
  props: ['count'],
  methods: {
    increment() {
      this.count++  // 警告！不要修改 prop
    }
  }
}
</script>
```

```vue
<!-- ✅ 正确：复制到 data 中再修改 -->
<script>
export default {
  props: ['count'],
  data() {
    return {
      localCount: this.count  // 复制一份
    }
  },
  methods: {
    increment() {
      this.localCount++
    }
  }
}
</script>
```

## 子传父：$emit

子组件通过 **$emit** 触发事件，父组件监听：

```vue
<!-- 子组件 HmButton.vue -->
<template>
  <button @click="handleClick">{{ label }}</button>
</template>

<script>
export default {
  props: ['label'],
  methods: {
    handleClick() {
      // 触发自定义事件，携带数据
      this.$emit('click', '子组件传来的数据')
    }
  }
}
</script>
```

```vue
<!-- 父组件 App.vue -->
<template>
  <div>
    <HmButton label="提交" @click="handleChildClick" />
    <p>收到：{{ message }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return { message: '' }
  },
  methods: {
    handleChildClick(data) {
      this.message = data  // 接收子组件传递的数据
    }
  }
}
</script>
```

### 完整案例：计数器组件

```vue
<!-- Counter.vue（子组件） -->
<template>
  <div>
    <button @click="count--">-</button>
    <span>{{ count }}</span>
    <button @click="count++">+</button>
  </div>
</template>

<script>
export default {
  props: ['value'],
  data() {
    return { count: this.value }
  },
  watch: {
    count(newVal) {
      this.$emit('input', newVal)  // 通知父组件
    }
  }
}
</script>
```

```vue
<!-- 父组件使用 -->
<template>
  <Counter :value="num" @input="num = $event" />
</template>

<!-- 等价的 v-model 写法 -->
<template>
  <Counter v-model="num" />
</template>
```

## Scoped 样式

### 样式冲突问题

默认情况下，`<style>` 里的 CSS 是**全局生效**的：

```vue
<!-- 组件A -->
<style>
.title { color: red; }    /* 全局生效 */
</style>

<!-- 组件B -->
<style>
.title { color: blue; }   /* 也会全局生效，覆盖A */
</style>
```

### Scoped 原理

加上 `scoped` 后，样式只作用于当前组件：

```vue
<style scoped>
.title { color: red; }
</style>
```

编译后自动变成：

```html
<!-- 模板 -->
<div class="title" data-v-7ba5bd90>...</div>

<!-- 样式 -->
.title[data-v-7ba5bd90] { color: red; }
```

每个组件有唯一的 `data-v-hash`，通过属性选择器实现隔离。

### Scoped 下修改子组件样式

```vue
<style scoped>
/* ❌ 不生效：scoped 样式无法渗透到子组件 */
.child-class { color: red; }

/* ✅ 使用深度选择器 */
:deep(.child-class) { color: red; }
</style>
```

::: tip Vue 2 vs Vue 3 深度选择器
- Vue 2：`::v-deep(.child-class)` 或 `/deep/`
- Vue 3：`:deep(.child-class)`
:::

## 非父子通信：provide / inject

跨多层组件传递数据，不用一层层 props 往下传：

```vue
<!-- 祖先组件 -->
<script>
export default {
  provide() {
    return {
      theme: 'dark',           // 提供数据
      userInfo: this.userInfo  // 提供响应式数据（Vue 3 用 computed）
    }
  }
}
</script>
```

```vue
<!-- 任意后代组件 -->
<script>
export default {
  inject: ['theme', 'userInfo'],
  mounted() {
    console.log(this.theme)  // 'dark'
  }
}
</script>
```

## 通信方式速查

| 场景 | 方式 | 代码示例 |
|------|------|----------|
| 父 → 子 | props | `<Child :data="val" />` |
| 子 → 父 | $emit | `this.$emit('event', data)` |
| 跨层级 | provide/inject | `provide()` + `inject: [...]` |
| 任意组件 | Vuex / Pinia | 全局状态管理 |

## 总结

- **Props** 是父传子的通道，只读不可修改
- **$emit** 是子传父的通道，触发自定义事件
- **Scoped** 解决组件间样式冲突，用 `data-v-hash` 隔离
- **provide/inject** 解决跨层级传值问题

**下一篇**：v-model 本质、ref/$refs 获取 DOM、$nextTick 异步更新。
