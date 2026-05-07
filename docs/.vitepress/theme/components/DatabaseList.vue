<script setup lang="ts">
// @ts-ignore: VitePress virtual module
import { data as databasePosts } from '../../database.data'
</script>

<template>
  <div class="database-list">
    <h1>数据库 <Badge type="info" :text="`${databasePosts.length} 篇`" /></h1>
    <p>MySQL、Redis、MongoDB 等数据库技术。</p>

    <div class="database-items">
      <a v-for="post in databasePosts" :key="post.url" :href="post.url" class="database-item">
        <div class="database-title">{{ post.title }}</div>
        <div v-if="post.readTime" class="database-meta">{{ post.readTime }}</div>
      </a>
    </div>
  </div>
</template>

<style scoped>
.database-list {
  max-width: 800px;
  margin: 0 auto;
}

.database-list h1 { margin-bottom: 1.5rem; }

.database-list p {
  color: var(--vp-c-text-2);
  margin-bottom: 2rem;
}

.database-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.database-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s;
}

.database-item:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-soft);
}

.database-title {
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.database-meta {
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
  white-space: nowrap;
}
</style>
