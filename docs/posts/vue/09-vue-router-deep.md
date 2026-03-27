---
title: '[09] Vue Router 路由实战：从基础使用到导航守卫'
category: vue
tags: ['Vue Router', 'SPA', '路由']
date: 2026-03-22
readTime: '18 min'
order: 9
---

## 什么是 SPA？

传统多页应用：每个页面一个 HTML，跳转 = 整页刷新。

SPA 单页应用：**只有一个 HTML**，通过 JS 动态替换内容，URL 变了但页面没刷新。

| 维度 | SPA | 多页应用 |
|------|-----|---------|
| 页面数量 | 1 个 HTML | 多个 HTML |
| 跳转方式 | 按需更新局部 | 整页刷新 |
| 性能 | 高（首屏后流畅） | 低（每次重载） |
| 首屏加载 | 慢（JS 包大） | 快 |
| 适用场景 | 管理后台、内部系统 | 官网、电商 |

## 路由 = 路径与组件的映射

| URL 路径 | 显示的组件 |
|----------|-----------|
| `/home` | Home.vue |
| `/find` | Find.vue |
| `/friend` | Friend.vue |

## 5 步搭建 Vue Router

### 第 1 步：安装

```bash
npm install vue-router@3.6.5   # Vue 2 项目
# npm install vue-router@4     # Vue 3 项目
```

### 第 2 步：创建页面组件

```
src/views/
├── Find.vue
├── My.vue
└── Friend.vue
```

```vue
<!-- src/views/Find.vue -->
<template>
  <div>
    <h2>发现音乐</h2>
    <p>推荐歌单、排行榜、最新音乐...</p>
  </div>
</template>
```

### 第 3 步：创建路由配置

```javascript
// src/router/index.js
import Vue from 'vue'
import VueRouter from 'vue-router'
import Find from '@/views/Find.vue'
import My from '@/views/My.vue'
import Friend from '@/views/Friend.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/find' },  // 重定向
    { path: '/find', component: Find },
    { path: '/my', component: My },
    { path: '/friend', component: Friend },
    { path: '*', component: () => import('@/views/NotFound.vue') }  // 404
  ]
})

export default router
```

### 第 4 步：注入路由

```javascript
// src/main.js
import Vue from 'vue'
import App from './App.vue'
import router from './router'

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
```

### 第 5 步：配置导航和出口

```vue
<!-- App.vue -->
<template>
  <div>
    <!-- 声明式导航 -->
    <nav>
      <router-link to="/find">发现音乐</router-link>
      <router-link to="/my">我的音乐</router-link>
      <router-link to="/friend">朋友</router-link>
    </nav>

    <!-- 路由出口：匹配的组件展示位置 -->
    <router-view />
  </div>
</template>
```

## 路由模式

```javascript
const router = new VueRouter({
  mode: 'hash',      // 默认：/#/find
  // mode: 'history', // 干净 URL：/find（需服务器配置）
  routes: [...]
})
```

| 模式 | URL | 优缺点 |
|------|-----|--------|
| `hash` | `/#/find` | 兼容性好，无需服务器配置 |
| `history` | `/find` | URL 干净，需服务器支持（否则刷新 404） |

## 声明式导航

### router-link

```html
<!-- 字符串路径 -->
<router-link to="/find">发现</router-link>

<!-- 对象形式 -->
<router-link :to="{ path: '/find' }">发现</router-link>

<!-- 带查询参数 -->
<router-link :to="{ path: '/detail', query: { id: 123 } }">详情</router-link>
<!-- URL: /detail?id=123 -->
```

### 导航高亮

`router-link` 匹配成功时自动添加 `router-link-active` 类：

```css
/* 当前激活路由的样式 */
.router-link-active {
  color: #42b983;
  font-weight: bold;
}

/* 精确匹配（完全相等才加类） */
.router-link-exact-active {
  border-bottom: 2px solid #42b983;
}
```

## 编程式导航

用 JS 代码控制跳转：

```javascript
// 字符串路径
this.$router.push('/find')

// 对象形式
this.$router.push({ path: '/find' })

// 带参数
this.$router.push({ path: '/detail', query: { id: 123 } })

// 动态路由参数
this.$router.push({ name: 'detail', params: { id: 123 } })

// 替换当前记录（不可后退）
this.$router.replace('/find')

// 后退 / 前进
this.$router.go(-1)
this.$router.go(1)
```

## 路由传参

### 方式一：query 参数

```javascript
// 路由配置
{ path: '/detail', component: Detail }

// 跳转
this.$router.push({ path: '/detail', query: { id: 123 } })
// URL: /detail?id=123

// 获取
console.log(this.$route.query.id)  // '123'
```

### 方式二：动态路由参数

```javascript
// 路由配置（:id 是动态参数）
{ path: '/detail/:id', component: Detail }

// 跳转
this.$router.push('/detail/123')
// URL: /detail/123

// 获取
console.log(this.$route.params.id)  // '123'
```

### 方式三：props 传参

```javascript
// 路由配置
{ path: '/detail/:id', component: Detail, props: true }
```

```vue
<!-- Detail.vue 直接用 props 接收 -->
<script>
export default {
  props: ['id'],  // 直接接收路由参数
  mounted() {
    console.log(this.id)  // '123'
  }
}
</script>
```

## 嵌套路由

页面中有子页面时使用：

```javascript
const router = new VueRouter({
  routes: [
    {
      path: '/user',
      component: User,
      children: [
        { path: '', component: UserProfile },      // /user
        { path: 'posts', component: UserPosts },    // /user/posts
        { path: 'settings', component: UserSettings } // /user/settings
      ]
    }
  ]
})
```

```vue
<!-- User.vue -->
<template>
  <div>
    <h2>用户中心</h2>
    <nav>
      <router-link to="/user">资料</router-link>
      <router-link to="/user/posts">文章</router-link>
    </nav>
    <!-- 子路由出口 -->
    <router-view />
  </div>
</template>
```

## 导航守卫

在路由跳转前后执行逻辑，如权限校验。

### 全局前置守卫

```javascript
// src/router/index.js
router.beforeEach((to, from, next) => {
  // to: 目标路由
  // from: 来源路由
  // next: 放行函数

  const token = localStorage.getItem('token')

  if (to.path === '/login') {
    next()  // 登录页直接放行
  } else if (!token) {
    next('/login')  // 没有 token，跳转登录
  } else {
    next()  // 有 token，放行
  }
})
```

### 路由独享守卫

```javascript
{
  path: '/admin',
  component: Admin,
  beforeEnter: (to, from, next) => {
    if (localStorage.getItem('role') === 'admin') {
      next()
    } else {
      next('/403')
    }
  }
}
```

### 组件内守卫

```vue
<script>
export default {
  beforeRouteEnter(to, from, next) {
    // 组件渲染前调用（不能访问 this）
    next(vm => {
      // 通过回调访问组件实例
      console.log(vm.someData)
    })
  },
  beforeRouteLeave(to, from, next) {
    // 离开当前路由前调用
    if (this.hasUnsavedChanges) {
      if (confirm('有未保存的更改，确定离开？')) {
        next()
      } else {
        next(false)  // 取消跳转
      }
    } else {
      next()
    }
  }
}
</script>
```

## 路由懒加载

首屏不加载所有页面组件，按需加载提升性能：

```javascript
// ❌ 所有组件一次性打包
import Home from '@/views/Home.vue'
import About from '@/views/About.vue'

// ✅ 懒加载：访问时才加载
const Home = () => import('@/views/Home.vue')
const About = () => import('@/views/About.vue')

const router = new VueRouter({
  routes: [
    { path: '/', component: Home },
    { path: '/about', component: About },
  ]
})
```

## 目录规范

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
└── main.js
```

**区分**：
- `views/` — 页面组件，通常对应一个路由
- `components/` — 复用组件，被多个页面引用

## 总结

| 功能 | API |
|------|-----|
| 声明式导航 | `<router-link to="...">` |
| 路由出口 | `<router-view />` |
| 编程式导航 | `this.$router.push()` |
| 获取参数 | `this.$route.query` / `this.$route.params` |
| 导航守卫 | `router.beforeEach()` |
| 懒加载 | `() => import('...')` |

**下一篇**：Vuex 状态管理——让组件之间的数据不再需要层层传递。
