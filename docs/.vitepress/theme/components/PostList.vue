<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vitepress'
import { data as posts } from '../../posts.data'

const route = useRoute()

const categoryMap: Record<string, string> = {
  springboot: 'Spring Boot',
  springmvc: 'Spring MVC',
  frontend: '前端',
  backend: '后端',
  linux: 'Linux',
  database: '数据库',
  devops: 'DevOps',
  arch: '架构',
}

const categoryOrder = Object.keys(categoryMap)

// 当前分类（从 URL 参数读取）
const currentCat = computed(() => {
  const params = new URLSearchParams(route.query as Record<string, string>)
  return params.get('cat') || ''
})

// 是否有分类筛选
const hasFilter = computed(() => !!currentCat.value)

// 筛选后的文章
const filteredPosts = computed(() => {
  if (!hasFilter.value) return posts
  return posts.filter(p => p.category === currentCat.value)
})

// 当前分类的中文名
const currentCatName = computed(() => {
  return categoryMap[currentCat.value] || ''
})

// 按分类分组（全部文章时）
const grouped = computed(() => {
  if (hasFilter.value) return []
  return categoryOrder
    .filter(cat => posts.some(p => p.category === cat))
    .map(cat => ({
      key: cat,
      name: categoryMap[cat],
      posts: posts
        .filter(p => p.category === cat)
        .sort((a, b) => b.date.localeCompare(a.date)),
    }))
})
</script>

<template>
  <div class="post-list">
    <!-- 按分类筛选模式 -->
    <template v-if="hasFilter">
      <h1>{{ currentCatName }} <Badge type="info" :text="`${filteredPosts.length} 篇`" /></h1>
      <ul>
        <li v-for="post in filteredPosts" :key="post.url">
          <a :href="post.url">{{ post.title }}</a>
          <span class="date">{{ post.date }}</span>
        </li>
      </ul>
    </template>

    <!-- 全部文章模式 -->
    <template v-else>
      <h1>全部文章 <Badge type="info" :text="`${posts.length} 篇`" /></h1>
      <div v-for="group in grouped" :key="group.key" class="category-group">
        <h2>{{ group.name }}</h2>
        <ul>
          <li v-for="post in group.posts" :key="post.url">
            <a :href="post.url">{{ post.title }}</a>
            <span class="date">{{ post.date }}</span>
          </li>
        </ul>
      </div>
    </template>
  </div>
</template>

<style scoped>
.post-list h1 {
  margin-bottom: 1.5rem;
}

.category-group {
  margin-bottom: 2rem;
}

.category-group h2 {
  border-bottom: 1px solid var(--vp-c-divider);
  padding-bottom: 0.5rem;
}

.post-list ul {
  list-style: none;
  padding: 0;
}

.post-list li {
  padding: 0.4rem 0;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
}

.post-list li a {
  flex: 1;
  font-weight: 500;
}

.post-list li a:hover {
  color: var(--vp-c-brand-1);
}

.date {
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
  white-space: nowrap;
}
</style>
