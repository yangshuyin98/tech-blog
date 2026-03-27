---
title: '[08] Vue 深入：v-model 原理、ref/$refs 与 $nextTick'
category: vue
tags: ['Vue', 'v-model', 'ref', '$nextTick']
date: 2026-03-21
readTime: '14 min'
order: 8
---

## v-model 的本质

`v-model` 看起来很神奇，其实它只是**语法糖**——`value` 属性和 `input` 事件的简写。

```vue
<!-- 这两行代码完全等价 -->
<input v-model="msg" type="text">
<input :value="msg" @input="msg = $event.target.value" type="text">
```

拆解原理：

| 部分 | 作用 | 对应 |
|------|------|------|
| `:value="msg"` | 数据变 → 视图变 | 单向绑定 |
| `@input="msg = $event.target.value"` | 视图变 → 数据变 | 事件监听 |
| `v-model` | 两者合一 | 双向绑定 |

::: tip $event 是什么？
`$event` 是 Vue 提供的特殊变量，代表**事件对象**。在原生 DOM 事件中，就是原生的 `Event` 对象。
:::

## 表单元素上的 v-model

不同表单元素，`v-model` 绑定的属性和事件不同：

| 元素 | 绑定属性 | 绑定事件 |
|------|----------|----------|
| `<input type="text">` | `value` | `input` |
| `<input type="checkbox">` | `checked` | `change` |
| `<input type="radio">` | `checked` | `change` |
| `<select>` | `value` | `change` |
| `<textarea>` | `value` | `input` |

## 表单组件封装与 v-model

封装一个下拉选择组件，支持 `v-model`：

```vue
<!-- CitySelect.vue（子组件） -->
<template>
  <select :value="value" @change="handleChange">
    <option value="1">北京</option>
    <option value="2">上海</option>
    <option value="3">广州</option>
  </select>
</template>

<script>
export default {
  props: ['value'],        // 接收父组件的值
  methods: {
    handleChange(e) {
      // 触发 input 事件，通知父组件更新
      this.$emit('input', e.target.value)
    }
  }
}
</script>
```

父组件使用：

```vue
<!-- 等价写法 -->
<CitySelect :value="cityId" @input="cityId = $event" />
<!-- 简写 -->
<CitySelect v-model="cityId" />
<p>选中的城市ID：{{ cityId }}</p>
```

## ref 和 $refs 获取 DOM

有时候需要直接操作 DOM 元素（比如聚焦输入框、获取元素尺寸），这时用 `ref`。

### 获取 DOM 元素

```vue
<template>
  <div>
    <input ref="myInput" type="text" placeholder="请输入">
    <button @click="focusInput">聚焦</button>
  </div>
</template>

<script>
export default {
  methods: {
    focusInput() {
      // 通过 this.$refs.ref名 获取 DOM
      this.$refs.myInput.focus()
    }
  }
}
</script>
```

### 获取子组件实例

```vue
<template>
  <ChildComponent ref="child" />
  <button @click="callChildMethod">调用子组件方法</button>
</template>

<script>
export default {
  methods: {
    callChildMethod() {
      // 获取子组件实例，调用其方法或访问数据
      this.$refs.child.someMethod()
      console.log(this.$refs.child.someData)
    }
  }
}
</script>
```

::: warning 注意
`$refs` 只有在组件**渲染完成后**才有值。在 `created` 阶段 `$refs` 是空的。
:::

## $nextTick 异步更新

### 问题：DOM 更新是异步的

```vue
<script>
export default {
  data() {
    return { message: '旧值' }
  },
  methods: {
    updateMessage() {
      this.message = '新值'

      // ❌ 此时 DOM 还没更新！
      console.log(this.$refs.msg.textContent)  // '旧值'
    }
  }
}
</script>
```

Vue 的 DOM 更新是**批量异步**的——数据变了不会立刻更新 DOM，而是等本轮事件循环结束后统一更新。

### $nextTick 的作用

`$nextTick` 确保在 DOM 更新完成后执行回调：

```vue
<script>
export default {
  methods: {
    updateMessage() {
      this.message = '新值'

      this.$nextTick(() => {
        // ✅ DOM 已更新
        console.log(this.$refs.msg.textContent)  // '新值'
      })
    }
  }
}
</script>
```

### 更新时序

```
this.message = '新值'    →  数据变更（同步）
                        →  Vue 标记需要更新（异步，加入队列）
                        →  本轮代码继续执行...
event loop 结束         →  Vue 批量更新 DOM
$nextTick 回调执行      →  此时 DOM 已是最新
```

### 实际应用场景

```vue
<script>
export default {
  methods: {
    async addItem() {
      this.items.push(newItem)

      // 等 DOM 更新后，滚动到最新添加的元素
      this.$nextTick(() => {
        const lastItem = this.$refs.list.lastElementChild
        lastItem.scrollIntoView({ behavior: 'smooth' })
      })
    },

    async showModal() {
      this.visible = true

      // 弹窗显示后，聚焦输入框
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    }
  }
}
</script>
```

## 三者联合使用案例

封装一个可编辑的表格单元格：

```vue
<!-- EditableCell.vue -->
<template>
  <div>
    <span v-if="!editing" @dblclick="startEdit">{{ value }}</span>
    <input
      v-else
      ref="editInput"
      :value="value"
      @blur="finishEdit"
      @keyup.enter="finishEdit"
      @input="$emit('input', $event.target.value)"
    >
  </div>
</template>

<script>
export default {
  props: ['value'],
  data() {
    return { editing: false }
  },
  methods: {
    startEdit() {
      this.editing = true
      // 等 DOM 更新后（input 渲染出来）再聚焦
      this.$nextTick(() => {
        this.$refs.editInput.focus()
      })
    },
    finishEdit() {
      this.editing = false
      this.$emit('change', this.value)
    }
  }
}
</script>
```

使用：

```vue
<EditableCell v-model="cellData" @change="saveData" />
```

## 总结

| 概念 | 作用 | 本质 |
|------|------|------|
| `v-model` | 双向绑定 | `:value` + `@input` 语法糖 |
| `ref` / `$refs` | 获取 DOM 或组件实例 | Vue 提供的引用机制 |
| `$nextTick` | 等 DOM 更新后执行 | 异步回调队列 |

**下一篇**：Vue Router——单页应用的路由系统，从基础使用到导航高亮。
