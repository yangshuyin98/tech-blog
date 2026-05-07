<script setup lang="ts">
// @ts-ignore: VitePress virtual module
import { data as guides } from '../../guide.data'
</script>

<template>
  <div class="guide-list">
    <h1>前端开发教程 <Badge type="info" :text="`${guides.length} 篇`" /></h1>
    <p>从零开始学习前端开发，包含 HTML、CSS、JavaScript 等基础知识。</p>

    <div class="guide-items">
      <a v-for="guide in guides" :key="guide.url" :href="guide.url" class="guide-item">
        <div class="guide-title">{{ guide.title }}</div>
        <div v-if="guide.readTime" class="guide-meta">{{ guide.readTime }}</div>
      </a>
    </div>
  </div>
</template>

<style scoped>
.guide-list {
  max-width: 800px;
  margin: 0 auto;
}

.guide-list h1 { margin-bottom: 1.5rem; }

.guide-list p {
  color: var(--vp-c-text-2);
  margin-bottom: 2rem;
}

.guide-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.guide-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s;
}

.guide-item:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-soft);
}

.guide-title {
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.guide-meta {
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
  white-space: nowrap;
}
</style>
