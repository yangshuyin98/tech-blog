---
title: '[01] Vue 快速入门：实例、模板语法与指令'
category: vue
tags: ['Vue', '入门', '模板语法', '指令']
date: 2026-03-14
readTime: '15 min'
order: 1
---

## 什么是 Vue？

Vue 是一套用于构建用户界面的**渐进式 JavaScript 框架**。

关键词：
- **渐进式**：可以只用一部分功能，也可以全家桶全上
- **框架**：不是库（jQuery），它规定了你写代码的方式
- **用户界面**：专注做页面，不管 Node.js 后端

## 引入 Vue

### 方式一：CDN（学习用）

```html
<div id="app">{{ message }}</div>

<script src="https://cdn.jsdelivr.net/npm/vue@2.7/dist/vue.js"></script>
<script>
  new Vue({
    el: '#app',
    data: {
      message: 'Hello Vue!'
    }
  })
</script>
```

### 方式二：Vue CLI（项目用）

```bash
npm install -g @vue/cli
vue create my-project
npm run serve
```

## Vue 实例

每个 Vue 应用都从创建一个 **Vue 实例**开始：

```javascript
const app = new Vue({
  el: '#app',          // 挂载到哪个 DOM 元素
  data: {              // 数据（响应式）
    message: '你好',
    count: 0,
    user: {
      name: '张三',
      age: 25
    }
  }
})
```

`data` 中的数据是**响应式的**——数据变了，视图自动更新。

```javascript
app.message = '新消息'    // 页面立刻更新
app.count++               // 页面立刻更新
```

## 模板语法

Vue 使用基于 HTML 的模板语法，把数据绑定到 DOM。

### 插值表达式 `{{ }}`

```html
<!-- 基本插值 -->
<p>{{ message }}</p>

<!-- 表达式（不是语句） -->
<p>{{ count + 1 }}</p>
<p>{{ message.split('').reverse().join('') }}</p>
<p>{{ isActive ? '激活' : '未激活' }}</p>

<!-- ❌ 不能写语句 -->
<!-- {{ var a = 1 }} -->
<!-- {{ if (ok) { } }} -->
```

### v-text 和 v-html

```html
<!-- v-text：纯文本输出（等价于 {{ }}） -->
<p v-text="message"></p>

<!-- v-html：输出 HTML（小心 XSS 攻击） -->
<div v-html="richText"></div>

<!-- 例：richText = '<strong>加粗文字</strong>' -->
<!-- 渲染结果：<strong>加粗文字</strong> -->
```

::: warning XSS 风险
永远不要对**用户输入**的内容使用 `v-html`，可能导致脚本注入攻击。
:::

## 常用指令

指令是带有 `v-` 前缀的特殊属性，作用是在表达式的值变化时，响应式地应用副作用到 DOM。

### v-bind — 属性绑定

```html
<!-- 完整写法 -->
<img v-bind:src="imageUrl" v-bind:alt="imageAlt">

<!-- 简写（:） -->
<img :src="imageUrl" :alt="imageAlt">
<a :href="link" :class="className">链接</a>
```

### v-on — 事件绑定

```html
<!-- 完整写法 -->
<button v-on:click="handleClick">点击</button>

<!-- 简写（@） -->
<button @click="handleClick">点击</button>
<button @mouseover="onHover" @mouseout="onLeave">悬停</button>
```

```javascript
new Vue({
  methods: {
    handleClick() {
      alert('被点击了')
    }
  }
})
```

### v-model — 双向绑定

```html
<input v-model="message" type="text">
<p>你输入的是：{{ message }}</p>

<!-- 数据变 → 视图变，视图变 → 数据变 -->
```

### v-if / v-else / v-else-if — 条件渲染

```html
<div v-if="score >= 90">优秀</div>
<div v-else-if="score >= 60">及格</div>
<div v-else>不及格</div>
```

### v-show — 显示/隐藏

```html
<div v-show="isVisible">我会显示或隐藏</div>
```

### v-for — 列表渲染

```html
<ul>
  <li v-for="(item, index) in list" :key="item.id">
    {{ index + 1 }}. {{ item.name }}
  </li>
</ul>
```

```javascript
data: {
  list: [
    { id: 1, name: '苹果' },
    { id: 2, name: '香蕉' },
    { id: 3, name: '橘子' }
  ]
}
```

::: tip :key 的重要性
`v-for` 必须加 `:key`，Vue 用它来追踪每个节点的身份，高效更新 DOM。用唯一标识（如 `id`），不要用 `index`。
:::

## 完整示例

```html
<div id="app">
  <!-- 插值 -->
  <h1>{{ title }}</h1>

  <!-- 属性绑定 -->
  <img :src="avatar" :alt="userName">

  <!-- 双向绑定 -->
  <input v-model="searchText" placeholder="搜索...">

  <!-- 条件渲染 -->
  <p v-if="searchText">你正在搜索：{{ searchText }}</p>
  <p v-else>请输入关键词</p>

  <!-- 列表渲染 -->
  <ul>
    <li v-for="item in filteredList" :key="item.id">
      {{ item.name }} - ¥{{ item.price }}
    </li>
  </ul>

  <!-- 事件绑定 -->
  <button @click="addItem">添加商品</button>
</div>
```

## 指令速查表

| 指令 | 作用 | 简写 |
|------|------|------|
| `v-bind` | 属性绑定 | `:` |
| `v-on` | 事件绑定 | `@` |
| `v-model` | 双向绑定 | — |
| `v-if` | 条件渲染（销毁/重建） | — |
| `v-show` | 显示/隐藏（display 切换） | — |
| `v-for` | 列表渲染 | — |
| `v-text` | 文本插值 | — |
| `v-html` | HTML 渲染 | — |

## 总结

Vue 的核心就是**数据驱动视图**——你只管改数据，DOM 更新交给 Vue。

- **模板语法**：`{{ }}` 插值、`v-bind`、`v-on`
- **指令**：`v-if`/`v-show` 条件、`v-for` 列表、`v-model` 双向绑定
- **响应式**：`data` 中的数据变了，页面自动更新

**下一篇**：深入数据绑定与事件处理——属性绑定的各种用法、事件修饰符、表单绑定细节。
