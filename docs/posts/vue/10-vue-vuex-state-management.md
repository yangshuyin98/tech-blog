---
title: '[10] Vuex 状态管理：全局数据共享实战'
category: vue
tags: ['Vuex', '状态管理', '全局数据']
date: 2026-03-23
readTime: '16 min'
order: 10
---

## 为什么需要 Vuex？

组件之间共享数据很麻烦：

```
App.vue（有用户信息）
├── Header.vue（需要显示用户名）    ← props 传来
├── Main.vue
│   ├── Sidebar.vue（需要显示头像） ← 再 props 传来
│   └── Content.vue
│       └── Comment.vue（需要用户ID）← 继续传来 😱
└── Footer.vue
```

数据要一层层 props 往下传，任何一层断了就传不过去。

**Vuex** 提供一个**全局数据仓库**，任何组件都能直接读写。

```
      ┌─────────────┐
      │    Vuex     │
      │   Store     │ ← 全局唯一数据源
      └──────┬──────┘
        ↙    ↓    ↘
  Header  Sidebar  Comment  ← 任何组件直接访问
```

## 核心概念

```
组件 dispatch → Action（异步） → commit → Mutation（同步） → State
     ↑                                                       ↓
     └───────────────── 读取 ←────────────────────────────────┘
```

| 概念 | 作用 | 类比 |
|------|------|------|
| **State** | 数据仓库 | data |
| **Getter** | 计算属性 | computed |
| **Mutation** | 同步修改 State | methods（唯一修改途径） |
| **Action** | 异步操作 | methods（调 API 后 commit） |

::: tip 核心原则
- **State** 是只读的
- 只能通过 **Mutation** 同步修改 State
- 异步操作放在 **Action** 里
:::

## 安装与配置

### 安装

```bash
npm install vuex@3    # Vue 2 项目
# npm install vuex@4  # Vue 3 项目（推荐用 Pinia）
```

### 创建 Store

```javascript
// src/store/index.js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {}
})
```

### 注入实例

```javascript
// src/main.js
import store from './store'

new Vue({
  render: h => h(App),
  store,
}).$mount('#app')
```

## State — 数据仓库

```javascript
// store/index.js
state: {
  count: 0,
  userInfo: null,
  cartList: [],
  token: localStorage.getItem('token') || ''
}
```

组件中访问：

```vue
<script>
export default {
  computed: {
    // 方式一：直接访问
    count() {
      return this.$store.state.count
    },

    // 方式二：mapState 辅助函数
    ...mapState(['count', 'userInfo', 'cartList'])
  }
}
</script>
```

## Mutations — 同步修改

```javascript
mutations: {
  // 第一个参数永远是 state
  INCREMENT(state) {
    state.count++
  },

  // 第二个参数是载荷（payload）
  SET_USER(state, user) {
    state.userInfo = user
  },

  ADD_TO_CART(state, product) {
    state.cartList.push(product)
  }
}
```

组件中提交：

```vue
<script>
export default {
  methods: {
    // 方式一：commit 调用
    increment() {
      this.$store.commit('INCREMENT')
    },

    // 带参数
    setUser() {
      this.$store.commit('SET_USER', { name: '张三', id: 1 })
    },

    // 对象风格提交
    setUser() {
      this.$store.commit({
        type: 'SET_USER',
        name: '张三',
        id: 1
      })
    },

    // 方式二：mapMutations
    ...mapMutations(['INCREMENT', 'SET_USER'])
  }
}
</script>
```

::: warning Mutation 必须是同步的
```javascript
// ❌ 错误：mutation 中不能有异步操作
mutations: {
  SET_USER(state) {
    setTimeout(() => {
      state.userInfo = { name: '张三' }  // devtools 无法追踪
    }, 1000)
  }
}
```
:::

## Actions — 异步操作

```javascript
actions: {
  // 第一个参数是 context（包含 commit, state, getters 等）
  async login({ commit }, { username, password }) {
    const res = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    })
    const user = await res.json()

    commit('SET_USER', user)           // 提交 mutation
    commit('SET_TOKEN', user.token)
    localStorage.setItem('token', user.token)
  },

  async fetchCart({ commit }) {
    const res = await fetch('/api/cart')
    const cart = await res.json()
    commit('SET_CART', cart)
  }
}
```

组件中分发：

```vue
<script>
export default {
  methods: {
    // 方式一：dispatch 调用
    async handleLogin() {
      await this.$store.dispatch('login', {
        username: 'admin',
        password: '123456'
      })
      this.$router.push('/dashboard')
    },

    // 方式二：mapActions
    ...mapActions(['login', 'fetchCart'])
  }
}
</script>
```

## Getters — 计算属性

```javascript
getters: {
  // 类似 computed，基于 state 派生新值
  cartItemCount(state) {
    return state.cartList.length
  },

  cartTotalPrice(state) {
    return state.cartList.reduce((sum, item) => {
      return sum + item.price * item.quantity
    }, 0)
  },

  // 可以接收其他 getter
  cartSummary(state, getters) {
    return `共 ${getters.cartItemCount} 件商品，合计 ¥${getters.cartTotalPrice}`
  },

  // 返回函数（带参数的 getter）
  getProductById: (state) => (id) => {
    return state.products.find(p => p.id === id)
  }
}
```

组件中使用：

```vue
<template>
  <div>
    <p>购物车：{{ $store.getters.cartSummary }}</p>
    <p>总价：¥{{ cartTotalPrice }}</p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['cartItemCount', 'cartTotalPrice'])
  }
}
</script>
```

## Modules — 模块化

项目大了，所有 state 放一个文件会很乱。用模块拆分：

```javascript
// store/modules/user.js
export default {
  namespaced: true,  // 开启命名空间
  state: {
    token: '',
    userInfo: null,
  },
  mutations: {
    SET_TOKEN(state, token) { state.token = token },
    SET_USER(state, user) { state.userInfo = user },
  },
  actions: {
    async login({ commit }, credentials) {
      // ...
    }
  }
}
```

```javascript
// store/index.js
import user from './modules/user'
import cart from './modules/cart'

export default new Vuex.Store({
  modules: {
    user,   // this.$store.state.user.token
    cart,   // this.$store.state.cart.items
  }
})
```

带命名空间的访问：

```vue
<script>
export default {
  computed: {
    // 命名空间模块
    ...mapState('user', ['token', 'userInfo']),
    ...mapGetters('cart', ['totalPrice']),
  },
  methods: {
    ...mapActions('user', ['login']),
    ...mapMutations('cart', ['ADD_ITEM']),
  }
}
</script>
```

## 完整实战：购物车

```javascript
// store/index.js
export default new Vuex.Store({
  state: {
    products: [
      { id: 1, name: 'iPhone 15', price: 7999 },
      { id: 2, name: 'MacBook Pro', price: 14999 },
    ],
    cart: []
  },

  getters: {
    cartItems(state) {
      return state.cart.map(item => {
        const product = state.products.find(p => p.id === item.id)
        return { ...product, quantity: item.quantity }
      })
    },
    totalPrice(state, getters) {
      return getters.cartItems.reduce((sum, item) =>
        sum + item.price * item.quantity, 0
      )
    }
  },

  mutations: {
    ADD_TO_CART(state, productId) {
      const item = state.cart.find(i => i.id === productId)
      if (item) {
        item.quantity++
      } else {
        state.cart.push({ id: productId, quantity: 1 })
      }
    },
    REMOVE_FROM_CART(state, productId) {
      state.cart = state.cart.filter(i => i.id !== productId)
    }
  },

  actions: {
    async checkout({ state, commit }) {
      await fetch('/api/checkout', {
        method: 'POST',
        body: JSON.stringify(state.cart)
      })
      commit('CLEAR_CART')
    }
  }
})
```

```vue
<!-- ProductList.vue -->
<template>
  <div>
    <div v-for="p in products" :key="p.id">
      <span>{{ p.name }} - ¥{{ p.price }}</span>
      <button @click="$store.commit('ADD_TO_CART', p.id)">加入购物车</button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: mapState(['products'])
}
</script>
```

```vue
<!-- Cart.vue -->
<template>
  <div>
    <div v-for="item in cartItems" :key="item.id">
      {{ item.name }} x {{ item.quantity }} = ¥{{ item.price * item.quantity }}
    </div>
    <p>总计：¥{{ totalPrice }}</p>
    <button @click="checkout">结算</button>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  computed: mapGetters(['cartItems', 'totalPrice']),
  methods: mapActions(['checkout'])
}
</script>
```

## 什么时候用 Vuex？

| 场景 | 需要 Vuex？ |
|------|-----------|
| 父子组件通信 | ❌ props/$emit |
| 兄弟组件通信 | ✅ Vuex |
| 跨多层组件 | ✅ Vuex |
| 用户登录状态 | ✅ 全局需要 |
| 购物车 | ✅ 多组件共享 |
| 单个页面的表单数据 | ❌ 组件内 data 就够 |

## Vue 3 推荐 Pinia

Vue 3 生态中，**Pinia** 已取代 Vuex：
- 更好的 TypeScript 支持
- 去掉 Mutation，Action 统一处理
- 更简洁的 API

如果是 Vue 3 新项目，直接上 Pinia。

## 总结

| 概念 | 作用 | 调用方式 |
|------|------|---------|
| State | 数据仓库 | `this.$store.state.xxx` |
| Getter | 计算属性 | `this.$store.getters.xxx` |
| Mutation | 同步修改 | `this.$store.commit('XXX')` |
| Action | 异步操作 | `this.$store.dispatch('xxx')` |

记住口诀：**同步 Mutation，异步 Action，数据只从 State 读**。

---

**Vue 系列完结** 🎉 10 篇文章覆盖了从零基础到状态管理的完整路径，建议按顺序学习。
