---
title: '[06] Vue 组件化开发：从根组件到局部注册'
category: vue
tags: ['Vue', '组件', 'Component']
date: 2026-03-19
readTime: '15 min'
order: 6
---

## 什么是组件化？

一个页面可以拆分成一个个独立的**组件**，每个组件有自己的结构（HTML）、样式（CSS）、行为（JS）。

```
App.vue（根组件）
├── Header.vue    ← 头部组件
├── Main.vue      ← 内容组件
│   ├── ProductCard.vue  ← 商品卡片（嵌套）
│   └── ProductCard.vue
└── Footer.vue    ← 底部组件
```

**好处**：代码复用、职责清晰、便于维护。

## .vue 文件结构

每个 Vue 组件都是一个 `.vue` 文件，包含三部分：

```vue
<template>
  <!-- 结构：有且只能有一个根元素 -->
  <div class="header">
    <h1>{{ title }}</h1>
  </div>
</template>

<script>
export default {
  name: 'HmHeader',        // 组件名
  data() {                  // 数据（必须是函数）
    return {
      title: '网站头部'
    }
  }
}
</script>

<style scoped>
/* 样式：scoped 表示只作用于当前组件 */
.header {
  background: #333;
  color: #fff;
}
</style>
```

::: tip 三个部分各司其职
- `<template>` — 长什么样（结构）
- `<script>` — 做什么（逻辑）
- `<style>` — 穿什么衣服（样式）
:::

## 根组件 App.vue

`App.vue` 是项目的**根组件**，所有其他组件都挂载在它下面。

```vue
<template>
  <div id="app">
    <!-- 头部组件 -->
    <HmHeader />
    <!-- 内容区 -->
    <HmMain />
    <!-- 底部组件 -->
    <HmFooter />
  </div>
</template>

<script>
import HmHeader from './components/HmHeader.vue'
import HmMain from './components/HmMain.vue'
import HmFooter from './components/HmFooter.vue'

export default {
  name: 'App',
  components: {
    HmHeader,
    HmMain,
    HmFooter,
  }
}
</script>
```

## 局部注册

**局部注册**的组件只能在注册它的组件内使用。

### 步骤

```javascript
// 1. 创建组件文件 components/HmHeader.vue

// 2. 在使用的地方导入并注册
import HmHeader from './components/HmHeader.vue'

export default {
  components: {
    'HmHeader': HmHeader,  // 完整写法
    HmHeader,              // ES6 简写（同名时）
  }
}

// 3. 在模板中使用
// <HmHeader />
```

### 完整示例

```vue
<template>
  <div class="app">
    <HmHeader />
    <HmMain />
    <HmFooter />
  </div>
</template>

<script>
import HmHeader from './components/HmHeader.vue'
import HmMain from './components/HmMain.vue'
import HmFooter from './components/HmFooter.vue'

export default {
  name: 'App',
  components: {
    HmHeader,
    HmMain,
    HmFooter,
  }
}
</script>

<style>
.app {
  width: 600px;
  margin: 0 auto;
}
</style>
```

## 全局注册

**全局注册**的组件在任何地方都能使用，无需再次导入。

在 `main.js` 中注册：

```javascript
import Vue from 'vue'
import App from './App.vue'
import HmButton from './components/HmButton.vue'

// 全局注册
Vue.component('HmButton', HmButton)

new Vue({
  render: h => h(App),
}).$mount('#app')
```

注册后，所有组件都能直接用：

```vue
<!-- 任何 .vue 文件中都可以直接使用 -->
<template>
  <HmButton>点击我</HmButton>
</template>
```

### 什么时候用全局 vs 局部？

| 注册方式 | 适用场景 | 优缺点 |
|----------|----------|--------|
| **局部** | 特定页面/组件才用的组件 | 按需加载，代码清晰 |
| **全局** | 项目中到处用的组件（按钮、弹窗、图标） | 方便，但全打包进去 |

::: tip 推荐
**默认用局部注册**，只对真正高频复用的组件（如 `ElButton`、`ElInput` 这种基础组件）才用全局注册。
:::

## 组件目录规范

```
src/
├── components/          ← 复用组件
│   ├── HmHeader.vue     ← 头部（多个页面复用）
│   ├── HmButton.vue     ← 按钮（到处用）
│   └── ProductCard.vue  ← 商品卡片
├── views/               ← 页面组件
│   ├── Home.vue         ← 首页
│   ├── Category.vue     ← 分类页
│   └── Search.vue       ← 搜索页
```

**区分标准**：
- `components/` — **复用组件**，被多个页面引用
- `views/` — **页面组件**，通常对应一个路由

## data 为什么必须是函数？

```javascript
export default {
  data() {
    return {
      count: 0
    }
  }
}
```

如果 `data` 是对象：

```javascript
// ❌ 错误：多个组件实例共享同一个数据对象
data: {
  count: 0
}
```

```javascript
// ✅ 正确：每次创建组件实例，都执行一次 data 函数，返回新对象
data() {
  return { count: 0 }
}
```

**原因**：保证每个组件实例维护**独立的一份数据**，互不影响。

## 总结

| 概念 | 说明 |
|------|------|
| `.vue` 文件 | template + script + style 三部分 |
| 根组件 | `App.vue`，项目的入口组件 |
| 局部注册 | `import` + `components`，只在当前组件可用 |
| 全局注册 | `Vue.component()`，所有组件可用 |
| `data()` | 必须是函数，保证数据独立 |
| `components/` | 放复用组件 |
| `views/` | 放页面组件 |

**下一篇**：组件通信——父传子、子传父、非父子组件如何传递数据。
