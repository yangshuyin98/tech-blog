<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'
import { data as posts } from '../../posts.data'

const route = useRoute()

const categoryMap: Record<string, string> = {
  springboot: 'Spring Boot',
  springmvc: 'Spring MVC',
  frontend: '前端',
  vue: 'Vue',
  backend: '后端',
  linux: 'Linux',
  database: '数据库',
  devops: 'DevOps',
  arch: '架构',
}

const categoryOrder = Object.keys(categoryMap)

const currentCat = ref('')

function updateCat() {
  // 从 URL 直接读取，最可靠
  const params = new URLSearchParams(window.location.search)
  currentCat.value = params.get('cat') || ''
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
        .sort((a, b) => b.date.localeCompare(a.date)),
    }))
})
</script>

<template>
  <div class="post-list">
    <template v-if="hasFilter">
      <h1>{{ currentCatName }} <Badge type="info" :text="`${filteredPosts.length} 篇`" /></h1>
      <ul>
        <li v-for="post in filteredPosts" :key="post.url">
          <a :href="post.url">{{ post.title }}</a>
          <span class="date">{{ post.date }}</span>
        </li>
      </ul>
    </template>

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
.post-list h1 { margin-bottom: 1.5rem; }
.category-group { margin-bottom: 2rem; }
.category-group h2 { border-bottom: 1px solid var(--vp-c-divider); padding-bottom: 0.5rem; }
.post-list ul { list-style: none; padding: 0; }
.post-list li { padding: 0.4rem 0; display: flex; justify-content: space-between; align-items: baseline; gap: 1rem; }
.post-list li a { flex: 1; font-weight: 500; }
.post-list li a:hover { color: var(--vp-c-brand-1); }
.date { font-size: 0.85rem; color: var(--vp-c-text-3); white-space: nowrap; }
</style>
