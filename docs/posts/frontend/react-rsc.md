---
title: 'React Server Components 实战：告别 useEffect 地狱'
category: frontend
tags: ['React', 'RSC']
date: 2026-03-18
readTime: '10 min'
---

## useEffect 地狱的本质
传统 React 应用中，数据获取往往是这样的：

```jsx
function ArticlePage({ id }) {
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticle(id).then(setArticle);
    fetchComments(id).then(setComments).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner />;
  return <div>...</div>;
}
```

问题在于：**客户端组件承担了太多数据获取职责**，导致瀑布式请求、状态管理复杂、SEO 不友好。

## Server Components 的核心思路
React Server Components (RSC) 的本质：**让组件可以在服务端运行，直接访问数据库和文件系统，零客户端 JS。**

```jsx
// 这是一个 Server Component — 不会发送到客户端
async function ArticlePage({ id }) {
  // 直接访问数据库，不需要 API
  const article = await db.article.findUnique({ where: { id } });
  const comments = await db.comment.findMany({ where: { articleId: id } });

  return (
    <div>
      <ArticleContent article={article} />
      <CommentSection comments={comments} />
      {/* 客户端交互组件 */}
      <LikeButton articleId={id} />
    </div>
  );
}
```

## 边界划分：Server vs Client
| 维度 | Server Component | Client Component |
| --- | --- | --- |
| 运行环境 | 服务端 | 浏览器 |
| 能用 hooks | ❌ 不能 | ✅ 可以 |
| 能访问数据库 | ✅ 可以 | ❌ 不能 |
| 能处理事件 | ❌ 不能 | ✅ 可以 |
| 客户端 JS 大小 | 0 | 包含在 bundle |
| 文件标记 | 默认 | `'use client'` |

## 流式渲染：Streaming SSR
RSC 配合 Suspense 可以实现**流式渲染**——服务端边生成边发送 HTML，客户端边接收边显示：

```jsx
async function Page() {
  return (
    <main>
      <Header /> {/* 立即渲染 */}
      <Suspense fallback={<ArticleSkeleton />}>
        <ArticleList /> {/* 加载完成后流式插入 */}
      </Suspense>
      <Suspense fallback={<CommentSkeleton />}>
        <Comments /> {/* 独立加载 */}
      </Suspense>
    </main>
  );
}
```

::: tip 最佳实践
不要把所有组件都标记为 Server Component。交互密集的 UI（表单、动画、实时更新）仍然适合 Client Component。关键是找到服务端和客户端的**边界**。
:::

## 总结
RSC 不是银弹，但它确实解决了 React 应用中的核心痛点：数据获取的复杂性和客户端 bundle 的膨胀。理解"边界划分"是用好 RSC 的关键。
