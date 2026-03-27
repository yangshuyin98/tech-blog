import { defineConfig } from 'vitepress'

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
      { text: '文章', link: '/posts/' },
      {
        text: '分类',
        items: [
          { text: 'Spring Boot', link: '/posts/?cat=springboot' },
          { text: 'Spring MVC', link: '/posts/?cat=springmvc' },
          { text: '前端', link: '/posts/?cat=frontend' },
          { text: 'Vue', link: '/posts/?cat=vue' },
          { text: '后端', link: '/posts/?cat=backend' },
          { text: 'Linux', link: '/posts/?cat=linux' },
          { text: 'CentOS', link: '/posts/?cat=centos' },
          { text: '数据库', link: '/posts/?cat=database' },
          { text: 'DevOps', link: '/posts/?cat=devops' },
          { text: '架构', link: '/posts/?cat=arch' },
        ],
      },
      { text: '关于', link: '/about/' },
    ],

    sidebar: [
      {
        text: '文章',
        items: [
          { text: '全部文章', link: '/posts/' },
        ],
      },
    ],

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
})
