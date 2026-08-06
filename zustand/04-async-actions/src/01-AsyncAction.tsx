// 异步 Action：在 action 里使用 async/await
// Zustand 的 action 可以是异步函数——set 在任何时刻都可以调用
import { create } from "zustand"

interface Post {
  id: number
  title: string
  body: string
}

interface PostStore {
  posts: Post[]
  // 异步 action：从 API 获取数据
  fetchPosts: () => Promise<void>
}

const usePostStore = create<PostStore>()((set) => ({
  posts: [],
  // 异步 action 本质上就是异步函数，内部使用 await 后调用 set
  fetchPosts: async () => {
    // 模拟网络请求（使用 JSONPlaceholder 免费 API）
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/posts?_limit=3",
    )
    const data: Post[] = await response.json()
    set({ posts: data })
  },
}))

export default function AsyncAction() {
  const posts = usePostStore((s) => s.posts)
  const fetchPosts = usePostStore((s) => s.fetchPosts)

  return (
    <div className="space-y-3">
      <button
        onClick={fetchPosts}
        className="rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600 transition-colors"
      >
        获取文章列表
      </button>
      {posts.length === 0 ? (
        <p className="text-sm text-zinc-400">点击按钮加载数据</p>
      ) : (
        <ul className="space-y-2">
          {posts.map((post) => (
            <li key={post.id} className="rounded bg-zinc-50 p-3 text-sm">
              <p className="font-medium text-zinc-800">{post.title}</p>
              <p className="mt-1 text-xs text-zinc-500">{post.body}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
