---
title: 纸质风格效果预览
tags: ['教程', '样式']
date: 2026-04-22
---

# 纸质风格效果预览

本页面展示不同的纸质风格效果。通过在 `<body>` 标签上添加不同的 class 来切换效果。

## 可用效果

| 效果 | class 名称 | 说明 |
|------|-----------|------|
| 横线笔记本 | `paper-lines` | 类似笔记本的横线效果 |
| 纸张纹理 | `paper-texture` | 细微的纸张纹理 |
| 旧纸发黄 | `paper-aged` | 渐变的旧纸效果 |
| 水印效果 | `paper-watermark` | 斜线水印图案 |
| 全部组合 | `paper-all` | 以上所有效果组合 |

## 如何使用

在 VitePress 的 `custom.css` 中，当前默认使用的是横线笔记本效果（`body` 的 `background-image`）。

要切换效果，修改 `body` 的 `background-image` 属性，或者在 HTML 中添加对应的 class：

```html
<!-- 使用旧纸发黄效果 -->
<body class="paper-aged">
```

## 预览说明

由于 VitePress 使用静态生成，无法在此页面动态切换效果。请查看 `custom.css` 中的以下部分：

```css
/* 横线笔记本效果 */
body.paper-lines { ... }

/* 纸张纹理效果 */
body.paper-texture { ... }

/* 旧纸发黄效果 */
body.paper-aged { ... }

/* 水印效果 */
body.paper-watermark { ... }

/* 全部效果组合 */
body.paper-all { ... }
```

## 当前默认效果

当前博客使用的是**横线笔记本**效果：

```css
body {
  background-color: var(--vp-c-bg);
  background-image:
    repeating-linear-gradient(0deg,
      transparent,
      transparent 29px,
      rgba(0, 0, 0, 0.03) 29px,
      rgba(0, 0, 0, 0.03) 30px);
}
```

## 推荐搭配

| 场景 | 推荐效果 |
|------|---------|
| 技术博客 | `paper-lines`（当前默认） |
| 文学/历史类 | `paper-aged` |
| 简约风格 | `paper-texture` |
| 创意/艺术类 | `paper-watermark` |
| 丰富层次感 | `paper-all` |
