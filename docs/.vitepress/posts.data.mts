import { createContentLoader } from 'vitepress'

export interface Post {
  title: string
  url: string
  date: string
  category: string
  tags: string[]
  readTime: string
  order: number
}

export declare const data: Post[]

function toString(val: unknown): string {
  if (!val) return ''
  if (val instanceof Date) return val.toISOString().slice(0, 10)
  return String(val)
}

export default createContentLoader('posts/**/*.md', {
  transform(raw): Post[] {
    return raw
      .filter(({ url }) => !url.endsWith('/'))
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
        // 先按 order 升序（order 越小越前）
        if (a.order !== b.order) return a.order - b.order
        // order 相同或都是 999，按日期降序（新文章在前）
        return b.date.localeCompare(a.date)
      })
  },
})
