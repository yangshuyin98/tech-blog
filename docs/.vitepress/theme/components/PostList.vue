<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'
// @ts-ignore: VitePress virtual module
import { data as posts } from '../../posts.data'

const route = useRoute()

const categoryMap: Record<string, string> = {
  springboot: 'Spring Boot',
  springmvc: 'Spring MVC',
  frontend: '前端',
  vue: 'Vue',  
  backend: '后端',
  linux: 'Linux',
  centos: 'CentOS',
  database: '数据库',
  devops: 'DevOps',
  arch: '架构',
}

const categoryOrder = Object.keys(categoryMap)

const currentCat = ref('')

function updateCat() {
  const path = window.location.pathname
  // 从路径中提取分类，如 /posts/springboot/ -> springboot
  const match = path.match(/\/posts\/(\w+)\/?$/)
  if (match && categoryMap[match[1]]) {
    currentCat.value = match[1]
  } else {
    // 兼容旧的查询参数方式 ?cat=xxx
    const params = new URLSearchParams(window.location.search)
    currentCat.value = params.get('cat') || ''
  }
}

onMounted(() => {
  updateCat()
  // 监听浏览器前进/后退
  window.addEventListener('popstate', updateCat)
  // VitePress SPA 导航：监听 route.query 变化
  watch(
    () => route.query,
    () => nextTick(updateCat)
  )
})

const hasFilter = computed(() => !!currentCat.value)

const filteredPosts = computed(() => {
  if (!hasFilter.value) return posts
  return posts.filter(p => p.category === currentCat.value)
})

const currentCatName = computed(() => {
  return categoryMap[currentCat.value] || ''
})

const grouped = computed(() => {
  if (hasFilter.value) return []
  return categoryOrder
    .filter(cat => posts.some(p => p.category === cat))
    .map(cat => ({
      key: cat,
      name: categoryMap[cat],
      posts: posts
        .filter(p => p.category === cat)
        .sort((a, b) => {
          if (a.order !== b.order) return a.order - b.order
          return b.date.localeCompare(a.date)
        }),
    }))
})
</script>

<template>
  <div class="post-list">
    <template v-if="hasFilter">
      <h1>{{ currentCatName }} <Badge type="info" :text="`${filteredPosts.length} 篇`" /></h1>
      <div class="post-items">
        <a v-for="post in filteredPosts" :key="post.url" :href="post.url" class="post-item">
          <div class="post-title">{{ post.title }}</div>
          <div class="post-meta">{{ post.date }}</div>
        </a>
      </div>
    </template>

    <template v-else>
      <h1>全部文章 <Badge type="info" :text="`${posts.length} 篇`" /></h1>
      <div v-for="group in grouped" :key="group.key" class="category-group">
        <h2>{{ group.name }}</h2>
        <div class="post-items">
          <a v-for="post in group.posts" :key="post.url" :href="post.url" class="post-item">
            <div class="post-title">{{ post.title }}</div>
            <div class="post-meta">{{ post.date }}</div>
          </a>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.post-list h1 { margin-bottom: 1.5rem; }
.category-group { margin-bottom: 2rem; }
.category-group h2 { border-bottom: 1px solid var(--vp-c-divider); padding-bottom: 0.5rem; margin-bottom: 1rem; }

.post-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.post-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s;
}

.post-item:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-soft);
}

.post-title {
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.post-meta {
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
  white-space: nowrap;
}
</style>
