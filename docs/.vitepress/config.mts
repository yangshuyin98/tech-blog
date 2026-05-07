import { defineConfig } from 'vitepress'
import { readdirSync, readFileSync } from 'fs'
import { resolve } from 'path'

// ============================================
// 方式1：子文件夹分类配置（posts、guides）
// 适用于有子文件夹的目录
// ============================================

// posts 子分类映射
const categoryMap: Record<string, string> = {
  springmvc: 'Spring MVC',
  frontend: '前端',
  vue: 'Vue',
  backend: '后端',
  linux: 'Linux',
  centos: 'CentOS',
  arch: '架构',
}

// 获取 posts 子分类下的文章列表
function getPostsByCategory(category: string) {
  const postsDir = resolve(__dirname, '../posts', category)
  try {
    const files = readdirSync(postsDir)
      .filter(f => f.endsWith('.md') && f !== 'index.md')
      .sort()

    return files.map(f => {
      const name = f.replace('.md', '')
      const content = readFileSync(resolve(postsDir, f), 'utf-8')
      const titleMatch = content.match(/^title:\s*(.+)$/m)
      const title = titleMatch ? titleMatch[1].trim() : name
      return { text: title, link: `/posts/${category}/${name}` }
    })
  } catch {
    return []
  }
}

// guides 子分类映射
const guidesCategoryMap: Record<string, string> = {
  'JavaWeb个人博客系统': 'JavaWeb 个人博客系统',
  '黑马前端教程': '黑马前端教程',
}

// 获取 guides 子分类下的文章列表
function getGuidesByCategory(category: string) {
  const guidesDir = resolve(__dirname, '../guides', category)
  try {
    const files = readdirSync(guidesDir)
      .filter(f => f.endsWith('.md') && f !== 'index.md')
      .sort()

    return files.map(f => {
      const name = f.replace('.md', '')
      const content = readFileSync(resolve(guidesDir, f), 'utf-8')
      const titleMatch = content.match(/^title:\s*(.+)$/m)
      const title = titleMatch ? titleMatch[1].trim() : name
      return { text: title, link: `/guides/${category}/${name}` }
    })
  } catch {
    return []
  }
}

// ============================================
// 方式2：独立分类配置（springboot、java 等）
// 适用于只有文件、没有子文件夹的目录
// ============================================

// 独立分类映射
const standaloneCategories: Record<string, string> = {
  springboot: 'Spring Boot',
  java: 'Java',
  database: '数据库',
  devops: 'DevOps',
}

// 获取独立分类下的文章列表
function getStandalonePosts(category: string) {
  const dir = resolve(__dirname, '../', category)
  try {
    const files = readdirSync(dir)
      .filter(f => f.endsWith('.md') && f !== 'index.md')
      .sort()

    return files.map(f => {
      const name = f.replace('.md', '')
      const content = readFileSync(resolve(dir, f), 'utf-8')
      const titleMatch = content.match(/^title:\s*(.+)$/m)
      const title = titleMatch ? titleMatch[1].trim() : name
      return { text: title, link: `/${category}/${name}` }
    })
  } catch {
    return []
  }
}

// ============================================
// VitePress 主配置
// ============================================

export default defineConfig({
  title: '技术博客',
  description: 'Spring Boot / Spring MVC / 前端 / 后端 / Linux 技术分享',
  lang: 'zh-CN',

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'author', content: 'yangshuyin98' }],
    ['style', {}, `
      .dark .VPHome,
      .dark .VPHomeHero,
      .dark .VPFeatures,
      .dark main,
      .dark .VPContent,
      .dark .VPContentContainer,
      .dark .Layout,
      .dark .VPNav,
      .dark .VPNavBar,
      .dark .VPSidebar {
        background: transparent !important;
        background-color: transparent !important;
      }
      .dark .VPHome * {
        background-color: transparent !important;
      }
      .dark .VPFlyout .menu,
      .dark .VPMenu,
      .dark .VPMenuGroup,
      .dark .VPMenuLink {
        background: #4a3628 !important;
        background-color: #4a3628 !important;
        border-color: #5a4435;
      }
      .dark .VPFeature {
        background: #4a3628 !important;
        border-color: #5a4435;
      }
      .dark .VPFeature:hover {
        background: #5a4435 !important;
      }
    `],
  ],

  themeConfig: {
    logo: '/logo.svg',

    // 导航栏配置
    nav: [
      { text: '首页', link: '/' },
      {
        text: '文章',
        items: [
          { text: '全部文章', link: '/posts/' },
          { text: 'Spring MVC', link: '/posts/springmvc/' },
          { text: '前端', link: '/posts/frontend/' },
          { text: 'Vue', link: '/posts/vue/' },
          { text: '后端', link: '/posts/backend/' },
          { text: 'Linux', link: '/posts/linux/' },
          { text: 'CentOS', link: '/posts/centos/' },
          { text: '架构', link: '/posts/arch/' },
        ],
      },
      {
        text: '教程',
        items: [
          { text: '全部教程', link: '/guides/' },
          { text: 'JavaWeb 个人博客系统', link: '/guides/JavaWeb个人博客系统/' },
          { text: '黑马前端教程', link: '/guides/黑马前端教程/' },
        ],
      },
      { text: 'Spring Boot', link: '/springboot/' },
      { text: 'Java', link: '/java/' },
      { text: '数据库', link: '/database/' },
      { text: 'DevOps', link: '/devops/' },
      { text: '关于', link: '/about/' },
    ],

    // 侧边栏配置
    sidebar: {
      // --- guides 主页侧边栏 ---
      '/guides/': [
        {
          text: '教程分类',
          items: Object.entries(guidesCategoryMap).map(([key, name]) => ({
            text: name,
            link: `/guides/${key}/`,
          })),
        },
      ],
      // --- guides 子分类侧边栏 ---
      ...Object.fromEntries(
        Object.entries(guidesCategoryMap).map(([key, name]) => [
          `/guides/${key}/`,
          [
            {
              text: name,
              items: getGuidesByCategory(key),
            },
            {
              text: '其他教程',
              items: Object.entries(guidesCategoryMap)
                .filter(([k]) => k !== key)
                .map(([k, n]) => ({ text: n, link: `/guides/${k}/` })),
            },
          ],
        ])
      ),

      // --- posts 主页侧边栏 ---
      '/posts/': [
        {
          text: '文章分类',
          items: Object.entries(categoryMap).map(([key, name]) => ({
            text: name,
            link: `/posts/${key}/`,
          })),
        },
      ],
      // --- posts 子分类侧边栏 ---
      ...Object.fromEntries(
        Object.entries(categoryMap).map(([key, name]) => [
          `/posts/${key}/`,
          [
            {
              text: name,
              items: getPostsByCategory(key),
            },
            {
              text: '其他分类',
              items: Object.entries(categoryMap)
                .filter(([k]) => k !== key)
                .map(([k, n]) => ({ text: n, link: `/posts/${k}/` })),
            },
          ],
        ])
      ),

      // --- 独立分类侧边栏（方式2）---
      ...Object.fromEntries(
        Object.entries(standaloneCategories).map(([key, name]) => [
          `/${key}/`,
          [
            {
              text: name,
              items: getStandalonePosts(key),
            },
          ],
        ])
      ),
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/yangshuyin98/tech-blog' },
    ],

    search: {
      provider: 'local',
    },

    outline: {
      label: '目录',
      level: [2, 3],
    },

    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },

    lastUpdated: {
      text: '最后更新于',
    },

    darkModeSwitchLabel: '外观',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '返回顶部',
  },

  lastUpdated: true,
  cleanUrls: true,

  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag) => ['font'].includes(tag),
      },
    },
  },

  markdown: {
    html: true,
    languageAlias: {
      jsp: 'html',
    },
  },
})
