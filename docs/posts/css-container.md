---
title: 'CSS Container Queries 终于可以用了：组件级响应式设计'
category: frontend
tags: ['CSS', '响应式']
date: 2026-03-03
readTime: '7 min'
---

## 媒体查询的局限
`@media` 查询的是**视口**大小。但组件应该根据**自己的容器**来决定布局，而不是页面宽度。

## Container Queries 基础
```css
.card-container {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 400px) {
  .card { display: grid; grid-template-columns: 200px 1fr; }
}

@container card (max-width: 399px) {
  .card { display: flex; flex-direction: column; }
}
```

## 实际应用：独立响应式卡片
同一个卡片组件放在侧边栏（窄）和主内容区（宽），自动适配不同布局：

```css
/* 侧边栏里：纵向排列 */
/* 主内容区：横向排列 */
/* 组件代码完全一样，只是容器宽度不同 */
```

## 总结
Container Queries 解决了 CSS 响应式设计的最后一块拼图。**组件级响应式**才是真正的组件化。2026 年，所有主流浏览器都已支持，放心使用。
