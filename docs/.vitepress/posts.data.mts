import { createContentLoader } from 'vitepress'

export interface Post {
  title: string
  url: string
  date: string
  category: string
  tags: string[]
  readTime: string
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
      }))
      .sort((a, b) => b.date.localeCompare(a.date))
  },
})
