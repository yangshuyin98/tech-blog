import { createContentLoader } from 'vitepress'

export interface Guide {
  title: string
  url: string
  date: string
  category: string
  tags: string[]
  readTime: string
  order: number
}

export declare const data: Guide[]

function toString(val: unknown): string {
  if (!val) return ''
  if (val instanceof Date) return val.toISOString().slice(0, 10)
  return String(val)
}

export default createContentLoader('guides/**/*.md', {
  transform(raw): Guide[] {
    return raw
      .filter(({ url }) => !url.endsWith('/'))
      .map(({ url, frontmatter }) => {
        // 从 URL 中提取分类，如 /guides/JavaWeb个人博客系统/xxx -> JavaWeb个人博客系统
        const match = url.match(/\/guides\/([^/]+)\//)
        const category = match ? match[1] : ''

        return {
          title: frontmatter.title || '未命名',
          url,
          date: toString(frontmatter.date),
          category,
          tags: frontmatter.tags || [],
          readTime: frontmatter.readTime || '',
          order: frontmatter.order ?? 999,
        }
      })
      .sort((a, b) => {
        if (a.order !== b.order) return a.order - b.order
        return b.date.localeCompare(a.date)
      })
  },
})
