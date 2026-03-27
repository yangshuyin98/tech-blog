---
title: '[02] 数据绑定与事件处理：属性、事件、表单绑定全解'
category: vue
tags: ['Vue', '数据绑定', '事件处理', '表单']
date: 2026-03-15
readTime: '16 min'
order: 2
---

## 属性绑定 v-bind

### 基础用法

```html
<!-- 绑定 src -->
<img :src="imgUrl">

<!-- 绑定 href -->
<a :href="link">跳转</a>

<!-- 绑定 disabled -->
<button :disabled="isLoading">提交</button>

<!-- 绑定多个属性 -->
<input :type="inputType" :placeholder="hint" :value="val">
```

### 动态 class 绑定

```html
<!-- 对象语法：key 是类名，value 是布尔条件 -->
<div :class="{ active: isActive, 'text-danger': hasError }">
  动态 class
</div>

<!-- isActive = true, hasError = false -->
<!-- 渲染为：<div class="active"> -->
```

```html
<!-- 数组语法 -->
<div :class="[activeClass, errorClass]">

<!-- 混合使用 -->
<div :class="[isActive ? 'active' : '', { error: hasError }]">
```

```html
<!-- 保留原有 class，追加动态 class -->
<div class="base" :class="{ active: isActive }">
<!-- 渲染为：<div class="base active"> -->
```

### 动态 style 绑定

```html
<!-- 对象语法（驼峰命名） -->
<div :style="{ color: textColor, fontSize: size + 'px' }">

<!-- 直接绑定对象 -->
<div :style="styleObject">
```

```javascript
data: {
  styleObject: {
    color: 'red',
    fontSize: '16px',
    backgroundColor: '#f0f0f0'
  }
}
```

## 事件处理 v-on

### 基础用法

```html
<!-- 直接执行表达式 -->
<button @click="count++">+1</button>

<!-- 调用方法 -->
<button @click="handleClick">点击</button>

<!-- 调用方法并传参 -->
<button @click="handleClick(id, name)">删除</button>

<!-- 传入事件对象 -->
<button @click="handleClick($event)">获取事件</button>
```

### 事件修饰符

```html
<!-- .stop 阻止冒泡 -->
<div @click="parentClick">
  <button @click.stop="childClick">点击不会触发父元素</button>
</div>

<!-- .prevent 阻止默认行为 -->
<form @submit.prevent="handleSubmit">
  <button type="submit">提交（不刷新页面）</button>
</form>

<!-- .once 只触发一次 -->
<button @click.once="handleOnce">只会触发一次</button>

<!-- .self 只有元素自身触发才执行 -->
<div @click.self="handleSelf">
  <button>点击按钮不会触发</button>
</div>

<!-- 串联修饰符 -->
<a @click.stop.prevent="handleClick">阻止冒泡且阻止默认</a>
```

### 按键修饰符

```html
<!-- 回车键 -->
<input @keyup.enter="submit">

<!-- 常用按键 -->
<input @keyup.enter="submit">
<input @keyup.esc="cancel">
<input @keyup.delete="clear">
<input @keyup.tab="next">
<input @keyup.up="moveUp">
<input @keyup.down="moveDown">

<!-- 组合键 -->
<input @keyup.ctrl.enter="submit">
<input @keyup.alt.s="save">
```

### 鼠标按钮修饰符

```html
<div @click.left="leftClick">左键</div>
<div @click.right="rightClick">右键</div>
<div @click.middle="middleClick">中键</div>
```

## 条件渲染深入

### v-if vs v-show

```html
<!-- v-if：条件为假时，DOM 元素被销毁/重建 -->
<div v-if="isVisible">内容A</div>

<!-- v-show：条件为假时，只是 display: none -->
<div v-show="isVisible">内容B</div>
```

| 对比 | v-if | v-show |
|------|------|--------|
| DOM 操作 | 销毁/重建 | 仅切换 CSS |
| 初始渲染 | 惰性（假时不渲染） | 总是渲染 |
| 切换开销 | 高 | 低 |
| 适用场景 | 条件很少变 | 频繁切换 |

::: tip 选择建议
- 条件**很少改变** → 用 `v-if`
- **频繁切换**显示/隐藏 → 用 `v-show`
:::

### v-if 与 v-for 优先级

```html
<!-- ❌ 不要同时用 v-if 和 v-for -->
<li v-for="item in list" v-if="item.active" :key="item.id">
  {{ item.name }}
</li>

<!-- ✅ 用 computed 过滤后再循环 -->
<li v-for="item in activeList" :key="item.id">
  {{ item.name }}
</li>
```

```javascript
computed: {
  activeList() {
    return this.list.filter(item => item.active)
  }
}
```

## 列表渲染深入

### 遍历数组

```html
<!-- 基本用法 -->
<li v-for="item in list" :key="item.id">{{ item.name }}</li>

<!-- 带索引 -->
<li v-for="(item, index) in list" :key="item.id">
  {{ index + 1 }}. {{ item.name }}
</li>
```

### 遍历对象

```html
<!-- 遍历对象的键值对 -->
<div v-for="(value, key, index) in user" :key="key">
  {{ index }}. {{ key }}: {{ value }}
</div>
```

```javascript
data: {
  user: {
    name: '张三',
    age: 25,
    city: '北京'
  }
}
<!-- 输出：
  0. name: 张三
  1. age: 25
  2. city: 北京
-->
```

### 遍历数字

```html
<!-- 从 1 开始 -->
<span v-for="n in 5" :key="n">{{ n }} </span>
<!-- 输出：1 2 3 4 5 -->
```

### 数组更新检测

Vue 能检测到的**响应式方法**：

```javascript
// ✅ 会触发视图更新
this.list.push({ id: 4, name: '新项目' })
this.list.pop()
this.list.shift()
this.list.unshift({ id: 0, name: '开头' })
this.list.splice(1, 1)              // 删除
this.list.splice(1, 0, newItem)     // 插入
this.list.sort()
this.list.reverse()

// ❌ 不会触发更新（替换数组引用）
this.list[0] = newItem              // 直接索引赋值
this.list.length = 0                // 修改 length

// ✅ 替换整个数组（Vue 会智能复用 DOM）
this.list = newList
```

## 表单绑定深入

### 各种输入类型

```html
<!-- 文本 -->
<input v-model="text">
<p>{{ text }}</p>

<!-- 多行文本 -->
<textarea v-model="bio"></textarea>

<!-- 复选框（单个） -->
<input type="checkbox" v-model="agreed">
<label>{{ agreed ? '已同意' : '未同意' }}</label>

<!-- 复选框（多个） -->
<input type="checkbox" value="苹果" v-model="fruits"> 苹果
<input type="checkbox" value="香蕉" v-model="fruits"> 香蕉
<input type="checkbox" value="橘子" v-model="fruits"> 橘子
<p>选中：{{ fruits }}</p>
<!-- fruits: ['苹果', '香蕉'] -->

<!-- 单选框 -->
<input type="radio" value="男" v-model="gender"> 男
<input type="radio" value="女" v-model="gender"> 女

<!-- 下拉选择 -->
<select v-model="city">
  <option value="bj">北京</option>
  <option value="sh">上海</option>
  <option value="gz">广州</option>
</select>
```

### 修饰符

```html
<!-- .lazy：change 事件时才同步（失焦或回车） -->
<input v-model.lazy="msg">

<!-- .number：自动转为数字 -->
<input v-model.number="age" type="number">

<!-- .trim：自动去除首尾空格 -->
<input v-model.trim="username">
```

## 总结

| 功能 | 语法 | 说明 |
|------|------|------|
| 属性绑定 | `:attr="val"` | 动态属性 |
| class 绑定 | `:class="{ active: true }"` | 动态类名 |
| style 绑定 | `:style="{ color: 'red' }"` | 动态样式 |
| 事件绑定 | `@click="handler"` | 事件监听 |
| 事件修饰符 | `.stop` `.prevent` `.once` | 阻止冒泡、默认行为等 |
| 条件渲染 | `v-if` / `v-show` | 显示/隐藏 |
| 列表渲染 | `v-for` + `:key` | 循环列表 |
| 表单绑定 | `v-model` | 双向绑定 |

**下一篇**：计算属性（computed）和侦听器（watch）——Vue 中数据变化的两种监听方式。
