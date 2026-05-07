import { createContentLoader } from 'vitepress'

export interface JavaPost {
  title: string
  url: string
  date: string
  category: string
  tags: string[]
  readTime: string
  order: number
}

export declare const data: JavaPost[]

function toString(val: unknown): string {
  if (!val) return ''
  if (val instanceof Date) return val.toISOString().slice(0, 10)
  return String(val)
}

export default createContentLoader('java/**/*.md', {
  transform(raw): JavaPost[] {
    return raw
      .filter(({ url }) => !url.endsWith('/') && url !== '/java/')
      .map(({ url, frontmatter }) => ({
        title: frontmatter.title || '未命名',
        url,
        date: toString(frontmatter.date),
        category: frontmatter.category || '',
        tags: frontmatter.tags || [],
        readTime: frontmatter.readTime || '',
        order: frontmatter.order ?? 999,
      }))
      .sort((a, b) => {
        if (a.order !== b.order) return a.order - b.order
        return b.date.localeCompare(a.date)
      })
  },
})
