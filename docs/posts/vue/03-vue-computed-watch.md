---
title: '[03] 计算属性与侦听器：computed vs watch 最佳实践'
category: vue
tags: ['Vue', 'computed', 'watch', '响应式']
date: 2026-03-16
readTime: '14 min'
order: 3
---

## 为什么需要计算属性？

假设要显示全名：

```html
<!-- 方式一：模板内直接拼接 -->
<p>{{ firstName + ' ' + lastName }}</p>

<!-- 方式二：方法调用 -->
<p>{{ getFullName() }}</p>

<!-- 方式三：计算属性（推荐） -->
<p>{{ fullName }}</p>
```

模板里写复杂表达式**难读难维护**，方法每次渲染都重新执行**浪费性能**。计算属性就是为了解决这两个问题。

## computed 计算属性

### 基本用法

```vue
<template>
  <div>
    <p>姓：{{ firstName }}</p>
    <p>名：{{ lastName }}</p>
    <p>全名：{{ fullName }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      firstName: '张',
      lastName: '三'
    }
  },
  computed: {
    fullName() {
      return this.firstName + ' ' + this.lastName
    }
  }
}
</script>
```

### 核心特性：缓存

```javascript
computed: {
  fullName() {
    console.log('computed 执行了')
    return this.firstName + ' ' + this.lastName
  }
}
```

| 操作 | computed 执行次数 | 说明 |
|------|------------------|------|
| 页面渲染（多次读取 fullName） | 1 次 | 结果被缓存，多次读取返回缓存值 |
| firstName 变了 | 再执行 1 次 | 依赖变化，重新计算并缓存 |
| 无关数据变了 | 0 次 | 依赖没变，用缓存 |

**对比 methods**：

```javascript
methods: {
  getFullName() {
    console.log('method 执行了')
    return this.firstName + ' ' + this.lastName
  }
}
```

| 操作 | methods 执行次数 |
|------|-----------------|
| 页面渲染（读取 3 次） | 3 次（每次调用都执行） |
| 任何数据变了 | 重新渲染时又执行 N 次 |

::: tip 一句话总结
**computed 有缓存**，依赖不变就返回缓存值；**methods 没缓存**，调用一次执行一次。
:::

### computed 的 setter

默认 computed 只有 getter（只读）。可以加 setter 实现双向：

```javascript
computed: {
  fullName: {
    get() {
      return this.firstName + ' ' + this.lastName
    },
    set(val) {
      const parts = val.split(' ')
      this.firstName = parts[0]
      this.lastName = parts[1]
    }
  }
}
```

```javascript
// 设置 fullName 会触发 setter
this.fullName = '李 四'
// 自动拆分：firstName = '李', lastName = '四'
```

## watch 侦听器

### 基本用法

```javascript
export default {
  data() {
    return {
      question: '',
      answer: '请输入问题'
    }
  },
  watch: {
    // 监听 question 的变化
    question(newVal, oldVal) {
      if (newVal.includes('?')) {
        this.answer = '思考中...'
      }
    }
  }
}
```

### 适用场景

computed 适合**根据其他数据算出新值**，watch 适合**数据变化时执行副作用**：

| 场景 | 用 computed | 用 watch |
|------|-------------|----------|
| 全名 = 姓 + 名 | ✅ | |
| 过滤列表 | ✅ | |
| 调用 API | | ✅ |
| 保存到 localStorage | | ✅ |
| 修改 DOM | | ✅ |
| 表单验证 | 都可以 | |

```javascript
// computed：计算值
computed: {
  totalPrice() {
    return this.items.reduce((sum, item) => sum + item.price * item.qty, 0)
  }
}

// watch：执行副作用
watch: {
  cart(newVal) {
    localStorage.setItem('cart', JSON.stringify(newVal))  // 保存
  },
  keyword(newVal) {
    this.searchAPI(newVal)  // 调用接口
  }
}
```

### 深度监听

```javascript
data() {
  return {
    user: { name: '张三', address: { city: '北京' } }
  }
},

watch: {
  // ❌ 浅监听：只监听 user 引用变化，不监听内部属性
  user(newVal) {
    console.log('user 变了')  // 修改 user.name 不会触发
  },

  // ✅ 深度监听
  user: {
    handler(newVal) {
      console.log('user 或其属性变了')
    },
    deep: true
  },

  // ✅ 监听嵌套属性（用字符串路径）
  'user.address.city'(newVal) {
    console.log('城市变了：', newVal)
  }
}
```

### 立即执行

```javascript
watch: {
  keyword: {
    handler(newVal) {
      this.search(newVal)
    },
    immediate: true  // 组件创建时立即执行一次
  }
}
```

## computed vs watch 对比

```javascript
// 同一个需求两种写法：根据价格和折扣计算最终价

// ✅ computed（推荐）
computed: {
  finalPrice() {
    return this.price * this.discount
  }
}

// ✅ watch（也能实现，但没必要）
watch: {
  price() { this.finalPrice = this.price * this.discount },
  discount() { this.finalPrice = this.price * this.discount }
}
```

| 对比 | computed | watch |
|------|----------|-------|
| 本质 | 根据依赖**计算**新值 | 监听变化**执行**副作用 |
| 返回值 | 有（模板中直接用） | 无（手动赋值） |
| 缓存 | 有（依赖不变返回缓存） | 无 |
| 异步 | 不支持 | 支持 |
| 适用 | 纯计算场景 | 副作用场景 |

## 实战案例

### 案例一：搜索过滤

```vue
<template>
  <div>
    <input v-model="keyword" placeholder="搜索商品">
    <ul>
      <li v-for="item in filteredList" :key="item.id">
        {{ item.name }} - ¥{{ item.price }}
      </li>
    </ul>
    <p>共 {{ filteredList.length }} 件商品</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      keyword: '',
      products: [
        { id: 1, name: 'iPhone 15', price: 7999 },
        { id: 2, name: 'MacBook Pro', price: 14999 },
        { id: 3, name: 'AirPods', price: 1299 },
      ]
    }
  },
  computed: {
    filteredList() {
      if (!this.keyword) return this.products
      const kw = this.keyword.toLowerCase()
      return this.products.filter(p =>
        p.name.toLowerCase().includes(kw)
      )
    }
  }
}
</script>
```

### 案例二：防抖搜索（watch + 异步）

```vue
<script>
export default {
  data() {
    return {
      keyword: '',
      timer: null
    }
  },
  watch: {
    keyword(newVal) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.fetchResults(newVal)
      }, 300)  // 300ms 防抖
    }
  },
  methods: {
    async fetchResults(keyword) {
      if (!keyword) return
      const res = await fetch(`/api/search?q=${keyword}`)
      this.results = await res.json()
    }
  }
}
</script>
```

## 总结

- **computed**：依赖其他数据计算新值，有缓存，适合纯计算
- **watch**：数据变化时执行副作用（API 调用、localStorage、DOM 操作）
- 优先用 computed，只有需要副作用时才用 watch
- 深度监听用 `deep: true`，立即执行用 `immediate: true`

**下一篇**：Vue 生命周期钩子——从创建到销毁的完整流程。
