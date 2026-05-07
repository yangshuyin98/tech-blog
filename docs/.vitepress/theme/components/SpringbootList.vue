<script setup lang="ts">
// @ts-ignore: VitePress virtual module
import { data as springboots } from '../../springboot.data'
</script>

<template>
  <div class="springboot-list">
    <h1>Springboot开发教程 <Badge type="info" :text="`${springboots.length} 篇`" /></h1>
    <p>从零开始学习Springboot等基础知识。</p>

    <div class="springboot-items">
      <a v-for="springboot in springboots" :key="springboot.url" :href="springboot.url" class="springboot-item">
        <div class="springboot-title">{{ springboot.title }}</div>
        <div v-if="springboot.readTime" class="springboot-meta">{{ springboot.readTime }}</div>
      </a>
    </div>
  </div>
</template>

<style scoped>
.springboot-list {
  max-width: 800px;
  margin: 0 auto;
}

.springboot-list h1 { margin-bottom: 1.5rem; }

.springboot-list p {
  color: var(--vp-c-text-2);
  margin-bottom: 2rem;
}

.springboot-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.springboot-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s;
}

.springboot-item:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-soft);
}

.springboot-title {
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.springboot-meta {
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
  white-space: nowrap;
}
</style>
