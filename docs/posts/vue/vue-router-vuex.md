---
title: 'Vue Router 与 Vuex：SPA 路由和状态管理实战'
category: vue
tags: ['Vue Router', 'Vuex', 'SPA', '状态管理']
date: 2026-03-23
readTime: '18 min'
---

## 单页应用程序（SPA）

传统多页应用：每个页面一个 HTML 文件，跳转 = 整页刷新。

```
index.html → 点击链接 → 刷新整个页面 → about.html
```

SPA 单页应用：**只有一个 HTML 文件**，通过 JS 动态替换内容。

```
index.html → 点击链接 → JS 替换局部内容 → URL 变了但页面没刷新
```

### SPA vs 多页对比

| 维度 | SPA | 多页应用 |
|------|-----|---------|
| 页面数量 | 1 个 HTML | 多个 HTML |
| 跳转方式 | 按需更新局部 | 整页刷新 |
| 性能 | 高（首屏后体验流畅） | 低（每次跳转都重载） |
| 首屏加载 | 慢（JS 包大） | 快 |
| SEO | 较差 | 好 |
| 适用场景 | 管理后台、内部系统 | 官网、电商 |

## Vue Router 基础

### 什么是路由？

**路由 = 路径与组件的映射关系**。

| URL 路径 | 显示的组件 |
|----------|-----------|
| `/home` | Home.vue |
| `/find` | Find.vue |
| `/friend` | Friend.vue |

### 安装（Vue 2 项目）

```bash
npm install vue-router@3.6.5
```

::: tip 版本对应
- Vue 2 → vue-router@3.x
- Vue 3 → vue-router@4.x
:::

### 5 步搭建路由

**第 1 步：创建页面组件**

```bash
src/views/
├── Find.vue
├── My.vue
└── Friend.vue
```

```vue
<!-- src/views/Find.vue -->
<template>
  <div>发现音乐</div>
</template>
```

**第 2 步：创建路由配置**

```javascript
// src/router/index.js
import Vue from 'vue'
import VueRouter from 'vue-router'
import Find from '@/views/Find.vue'
import My from '@/views/My.vue'
import Friend from '@/views/Friend.vue'

// 安装路由插件
Vue.use(VueRouter)

// 创建路由对象
const router = new VueRouter({
  routes: [
    { path: '/find', component: Find },
    { path: '/my', component: My },
    { path: '/friend', component: Friend },
  ]
})

export default router
```

**第 3 步：注入路由**

```javascript
// src/main.js
import router from './router'

new Vue({
  render: h => h(App),
  router,  // 注入路由对象
}).$mount('#app')
```

**第 4 步：配置导航链接**

```vue
<!-- App.vue -->
<template>
  <div>
    <!-- 导航 -->
    <nav>
      <router-link to="/find">发现音乐</router-link>
      <router-link to="/my">我的音乐</router-link>
      <router-link to="/friend">朋友</router-link>
    </nav>

    <!-- 路由出口：匹配的组件展示在这里 -->
    <router-view />
  </div>
</template>
```

**第 5 步：测试**

访问 `http://localhost:8080/#/find`，页面显示 Find 组件内容，点击导航切换。

### 路由模式

```javascript
const router = new VueRouter({
  mode: 'hash',    // 默认：URL 带 #（/#/find）
  // mode: 'history', // 干净 URL（/find），需要服务器配置
  routes: [...]
})
```

| 模式 | URL 格式 | 优缺点 |
|------|----------|--------|
| `hash` | `/#/find` | 兼容性好，无需服务器配置 |
| `history` | `/find` | URL 干净，需要服务器支持 |

## 路由进阶

### 路由重定向

```javascript
routes: [
  { path: '/', redirect: '/find' },  // 访问 / 自动跳转到 /find
  { path: '/find', component: Find },
]
```

### 404 页面

```javascript
routes: [
  // ... 其他路由
  { path: '*', component: NotFound }  // 匹配所有未定义的路径
]
```

### 编程式导航

除了 `<router-link>`，还可以用 JS 代码跳转：

```javascript
// 字符串路径
this.$router.push('/find')

// 对象形式
this.$router.push({ path: '/find' })

// 带参数
this.$router.push({ path: '/detail', query: { id: 123 } })
// URL: /detail?id=123

// 替换当前记录（不可后退）
this.$router.replace('/find')

// 后退
this.$router.go(-1)
```

### 路由传参

```javascript
// 方式一：query 参数
{ path: '/detail', component: Detail }
// URL: /detail?id=123
// 获取: this.$route.query.id

// 方式二：动态路由参数
{ path: '/detail/:id', component: Detail }
// URL: /detail/123
// 获取: this.$route.params.id
```

## Vuex 状态管理

### 为什么需要 Vuex？

组件之间共享数据很麻烦：

```
组件A 有用户信息 → 需要传给 B、C、D、E...
如果 B 是 A 的孙子组件，得一层层 props 往下传 😱
```

**Vuex** 是一个**全局状态管理工具**，所有组件都能直接读写。

### 核心概念

```
Action → Mutation → State
 ↑                   ↓
组件 dispatch      组件读取
```

| 概念 | 作用 |
|------|------|
| **State** | 数据仓库（唯一数据源） |
| **Mutation** | 同步修改 State（唯一修改方式） |
| **Action** | 异步操作（调用 API 后提交 Mutation） |
| **Getter** | 计算属性（类似 computed） |

### 安装

```bash
npm install vuex@3
```

### 基本使用

```javascript
// src/store/index.js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0,
    userInfo: null,
  },

  mutations: {
    INCREMENT(state) {
      state.count++
    },
    SET_USER(state, user) {
      state.userInfo = user
    }
  },

  actions: {
    // 异步操作：比如调用登录接口
    async login({ commit }, { username, password }) {
      const user = await api.login(username, password)
      commit('SET_USER', user)
    }
  },

  getters: {
    doubleCount(state) {
      return state.count * 2
    }
  }
})
```

注入 Vue 实例：

```javascript
// main.js
import store from './store'

new Vue({
  render: h => h(App),
  store,
}).$mount('#app')
```

### 在组件中使用

```vue
<template>
  <div>
    <p>计数：{{ $store.state.count }}</p>
    <p>双倍：{{ $store.getters.doubleCount }}</p>
    <button @click="$store.commit('INCREMENT')">+1</button>
    <button @click="login">登录</button>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    // 简化写法
    ...mapState(['count', 'userInfo']),
  },
  methods: {
    ...mapActions(['login']),
    handleLogin() {
      this.login({ username: 'admin', password: '123456' })
    }
  }
}
</script>
```

### 什么时候用 Vuex？

| 场景 | 是否需要 Vuex |
|------|--------------|
| 父子组件通信 | ❌ 用 props/$emit |
| 兄弟组件通信 | ✅ Vuex |
| 跨多层组件传值 | ✅ Vuex 或 provide/inject |
| 用户登录状态 | ✅ Vuex（全局需要） |
| 购物车数据 | ✅ Vuex（多组件共享） |

::: tip Vue 3 推荐 Pinia
Vue 3 生态中，**Pinia** 已经取代 Vuex 成为官方推荐的状态管理方案。类型支持更好、API 更简洁。如果是新项目，直接用 Pinia。
:::

## 项目目录规范

```
src/
├── views/          ← 页面组件（配合路由）
│   ├── Home.vue
│   ├── Find.vue
│   └── Detail.vue
├── components/     ← 复用组件
│   ├── Header.vue
│   └── ProductCard.vue
├── router/
│   └── index.js    ← 路由配置
├── store/
│   └── index.js    ← Vuex 配置
├── assets/         ← 静态资源
├── App.vue         ← 根组件
└── main.js         ← 入口文件
```

## 总结

| 工具 | 解决什么问题 | 核心 API |
|------|-------------|----------|
| **Vue Router** | URL 与组件的映射 | `router-link`、`router-view`、`$router.push` |
| **Vuex** | 全局数据共享 | `state`、`mutation`、`action`、`getter` |

Vue Router 让你的应用变成 SPA，Vuex 让组件之间的数据不再需要层层传递。两者配合，就是 Vue 2 项目的标准技术栈。

---

**Vue 系列完结** 🎉 五篇文章覆盖了从项目搭建到路由状态管理的完整流程。
