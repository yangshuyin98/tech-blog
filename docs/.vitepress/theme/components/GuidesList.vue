<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'
// @ts-ignore: VitePress virtual module
import { data as guides } from '../../guides.data'

const route = useRoute()

const categoryMap: Record<string, string> = {
  'JavaWeb个人博客系统': 'JavaWeb 个人博客系统',
  '黑马前端教程': '黑马前端教程',
}

const categoryOrder = Object.keys(categoryMap)

const currentCat = ref('')

function updateCat() {
  const path = window.location.pathname
  const match = path.match(/\/guides\/([^/]+)\/?$/)
  if (match && categoryMap[match[1]]) {
    currentCat.value = match[1]
  } else {
    currentCat.value = ''
  }
}

onMounted(() => {
  updateCat()
    // 监听浏览器前进/后退
  window.addEventListener('popstate', updateCat)
  // VitePress SPA 导航：监听 route.query 变化
  watch(
    () => route.path,
    () => nextTick(updateCat)
  )
})

const hasFilter = computed(() => !!currentCat.value)

const filteredGuides = computed(() => {
  if (!hasFilter.value) return guides
  return guides.filter((p: { category: string }) => p.category === currentCat.value)
})

const currentCatName = computed(() => {
  return categoryMap[currentCat.value] || ''
})

const grouped = computed(() => {
  if (hasFilter.value) return []
  return categoryOrder
    .filter(cat => guides.some((p: { category: string }) => p.category === cat))
    .map(cat => ({
      key: cat,
      name: categoryMap[cat],
      posts: guides.filter((p: { category: string }) => p.category === cat),
    }))
})
</script>

<template>
  <div class="guides-list">
    <template v-if="hasFilter">
      <h1>{{ currentCatName }} <Badge type="info" :text="`${filteredGuides.length} 篇`" /></h1>
      <div class="guide-items">
        <a v-for="guide in filteredGuides" :key="guide.url" :href="guide.url" class="guide-item">
          <div class="guide-title">{{ guide.title }}</div>
          <div v-if="guide.readTime" class="guide-meta">{{ guide.readTime }}</div>
        </a>
      </div>
    </template>

    <template v-else>
      <h1>教程 <Badge type="info" :text="`${guides.length} 篇`" /></h1>
      <div v-for="group in grouped" :key="group.key" class="category-group">
        <h2>{{ group.name }}</h2>
        <div class="guide-items">
          <a v-for="guide in group.posts" :key="guide.url" :href="guide.url" class="guide-item">
            <div class="guide-title">{{ guide.title }}</div>
            <div v-if="guide.readTime" class="guide-meta">{{ guide.readTime }}</div>
          </a>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.guides-list h1 { margin-bottom: 1.5rem; }
.category-group { margin-bottom: 2rem; }
.category-group h2 { border-bottom: 1px solid var(--vp-c-divider); padding-bottom: 0.5rem; margin-bottom: 1rem; }

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
