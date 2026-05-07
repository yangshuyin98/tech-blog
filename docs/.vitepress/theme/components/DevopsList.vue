<script setup lang="ts">
// @ts-ignore: VitePress virtual module
import { data as devopsPosts } from '../../devops.data'
</script>

<template>
  <div class="devops-list">
    <h1>DevOps <Badge type="info" :text="`${devopsPosts.length} 篇`" /></h1>
    <p>Docker、K8s、CI/CD 等 DevOps 技术。</p>

    <div class="devops-items">
      <a v-for="post in devopsPosts" :key="post.url" :href="post.url" class="devops-item">
        <div class="devops-title">{{ post.title }}</div>
        <div v-if="post.readTime" class="devops-meta">{{ post.readTime }}</div>
      </a>
    </div>
  </div>
</template>

<style scoped>
.devops-list {
  max-width: 800px;
  margin: 0 auto;
}

.devops-list h1 { margin-bottom: 1.5rem; }

.devops-list p {
  color: var(--vp-c-text-2);
  margin-bottom: 2rem;
}

.devops-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.devops-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s;
}

.devops-item:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-soft);
}

.devops-title {
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.devops-meta {
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
  white-space: nowrap;
}
</style>
