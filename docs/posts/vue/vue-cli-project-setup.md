---
title: 'Vue CLI 工程化入门：从零搭建 Vue 项目'
category: vue
tags: ['Vue CLI', '工程化', 'Webpack']
date: 2026-03-27
readTime: '12 min'
---

## 为什么需要工程化？

用 `<script>` 标签直接引入 Vue.js，写几个组件还行。但项目一旦复杂起来：

- 组件几十上百个，手动管理依赖关系？疯了
- 想用 ES6+ 语法、Less/Sass、TypeScript？浏览器不支持
- 代码压缩、图片优化、热更新？全要自己配

**工程化**就是用构建工具把这些事情自动化，让你专注写业务代码。

## Vue CLI 是什么？

Vue CLI 是 Vue.js 官方提供的**脚手架工具**，帮你快速创建一个标准化的 Vue 项目。

内置能力：
- **Webpack** 打包编译（ES6 → ES5、Less → CSS、压缩）
- **Babel** 语法降级（兼容低版本浏览器）
- **开发服务器** 热更新（改代码自动刷新）
- **ESLint** 代码检查
- **单元测试** 基础配置

## 安装 Vue CLI

```bash
# 全局安装（只需一次）
npm install -g @vue/cli

# 查看版本
vue --version
# @vue/cli 5.0.8
```

::: tip 版本说明
Vue CLI 5.x 对应 Vue 2 项目。如果你要用 Vue 3，推荐用 `create-vue`（基于 Vite）：
```bash
npm create vue@latest
```
:::

## 创建项目

```bash
vue create my-project
```

会进入交互式选择：

```
? Please pick a preset:
❯ Default ([Vue 3] babel, eslint)
  Default ([Vue 2] babel, eslint)
  Manually select features   ← 手动选择（推荐）
```

**手动选择模式**可以按需勾选：

```
? Check the features needed for your project:
 ◉ Babel
 ◉ TypeScript
 ◉ Router
 ◉ Vuex
 ◉ CSS Pre-processors  ← Less/Sass
 ◉ Linter / Formatter
```

## 项目目录结构

```
my-project/
├── public/
│   └── index.html          ← 模板文件，容器 <div id="app"></div>
├── src/
│   ├── main.js             ← 入口文件，第一个执行的文件
│   ├── App.vue             ← 根组件，页面看到的内容在这里写
│   ├── components/         ← 可复用组件
│   ├── views/              ← 页面组件（配合路由）
│   ├── router/             ← 路由配置
│   ├── store/              ← Vuex 状态管理
│   └── assets/             ← 静态资源（图片、字体）
├── babel.config.js         ← Babel 配置
├── package.json            ← 依赖和脚本
└── README.md
```

## 运行流程

执行 `npm run serve` 后发生了什么：

```
npm run serve
    ↓
main.js（入口文件）
    ↓
导入 Vue 核心包 + App.vue 根组件
    ↓
实例化 Vue，将 App.vue 渲染到 index.html 的 #app 容器
    ↓
浏览器显示页面
```

### main.js 源码解读

```javascript
import Vue from 'vue'           // 导入 Vue 核心包
import App from './App.vue'     // 导入 App.vue 根组件

Vue.config.productionTip = false // 阻止生产环境提示

new Vue({
  render: (createElement) => {  // 创建虚拟 DOM
    return createElement(App)   // 返回虚拟 DOM
  },
}).$mount('#app')               // 挂载到 #app 容器
```

简化写法：

```javascript
new Vue({
  render: h => h(App),
}).$mount('#app')
```

## 常用命令

```bash
npm run serve    # 启动开发服务器（热更新）
npm run build    # 构建生产版本（输出到 dist/）
npm run lint     # 代码检查
```

## 自定义配置

### 修改端口

在 `vue.config.js` 中：

```javascript
module.exports = {
  devServer: {
    port: 3000,        // 默认 8080
    open: true,        // 自动打开浏览器
  }
}
```

### 关闭 ESLint

```javascript
module.exports = {
  lintOnSave: false
}
```

## 总结

| 步骤 | 命令 | 说明 |
|------|------|------|
| 安装 | `npm i -g @vue/cli` | 全局安装一次 |
| 创建 | `vue create my-project` | 选预设或手动配置 |
| 开发 | `npm run serve` | 启动开发服务器 |
| 部署 | `npm run build` | 生成生产文件 |

Vue CLI 解决了「怎么搭项目」的问题，让你可以把精力放在「怎么写业务」上。

**下一篇**：深入讲解组件化开发——根组件、组件注册、目录规范。
