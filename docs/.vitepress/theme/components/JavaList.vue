<script setup lang="ts">
// @ts-ignore: VitePress virtual module
import { data as javaPosts } from '../../java.data'
</script>

<template>
  <div class="java-list">
    <h1>Java <Badge type="info" :text="`${javaPosts.length} 篇`" /></h1>
    <p>Java 基础、集合、多线程、JVM 等核心知识。</p>

    <div class="java-items">
      <a v-for="post in javaPosts" :key="post.url" :href="post.url" class="java-item">
        <div class="java-title">{{ post.title }}</div>
        <div v-if="post.readTime" class="java-meta">{{ post.readTime }}</div>
      </a>
    </div>
  </div>
</template>

<style scoped>
.java-list {
  max-width: 800px;
  margin: 0 auto;
}

.java-list h1 { margin-bottom: 1.5rem; }

.java-list p {
  color: var(--vp-c-text-2);
  margin-bottom: 2rem;
}

.java-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.java-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s;
}

.java-item:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-soft);
}

.java-title {
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.java-meta {
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
  white-space: nowrap;
}
</style>
