import { defineConfig } from 'vitepress'
import { readdirSync, readFileSync } from 'fs'
import { resolve, basename } from 'path'

// 自动扫描 guide 目录生成侧边栏
// function generateGuideSidebar() {
//   const guideDir = resolve(__dirname, '../guide')
//   const files = readdirSync(guideDir)
//     .filter(f => f.endsWith('.md') && f !== 'index.md')
//     .sort()

//   return files.map(f => {
//     const name = f.replace('.md', '')
//     // 从文件名生成可读标题
//     const title = name
//       .replace(/^day\d+-/, '')
//       .replace(/-/g, ' ')
//     return { text: title, link: `/guide/${name}` }
//   })
// }

// 分类配置
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

// 扫描文章目录获取文章列表
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

// 教程分类配置
const guidesCategoryMap: Record<string, string> = {
  'JavaWeb个人博客系统': 'JavaWeb 个人博客系统',
  '黑马前端教程': '黑马前端教程',
}

// 扫描教程目录获取文章列表
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


export default defineConfig({
  title: '技术博客',
  description: 'Spring Boot / Spring MVC / 前端 / 后端 / Linux 技术分享',
  lang: 'zh-CN',

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'author', content: 'yangshuyin98' }],
  ],

  themeConfig: {
    logo: '/logo.svg',
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

    sidebar: {
      '/guides/': [
        {
          text: '教程分类',
          items: Object.entries(guidesCategoryMap).map(([key, name]) => ({
            text: name,
            link: `/guides/${key}/`,
          })),
        },
      ],
      // 为每个 guides 子分类生成侧边栏
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
      '/posts/': [
        {
          text: '文章分类',
          items: Object.entries(categoryMap).map(([key, name]) => ({
            text: name,
            link: `/posts/${key}/`,
          })),
        },
      ],
      // 为每个 posts 子分类生成侧边栏
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
      // 独立专题侧边栏
      '/springboot/': [
        {
          text: 'Spring Boot',
          items: [
            { text: '全部文章', link: '/springboot/' },
          ],
        },
      ],
      '/java/': [
        {
          text: 'Java',
          items: [
            { text: '全部文章', link: '/java/' },
          ],
        },
      ],
      '/database/': [
        {
          text: '数据库',
          items: [
            { text: '全部文章', link: '/database/' },
          ],
        },
      ],
      '/devops/': [
        {
          text: 'DevOps',
          items: [
            { text: '全部文章', link: '/devops/' },
          ],
        },
      ],
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
