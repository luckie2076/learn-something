// 嵌套对象和数组的不可变更新
// 当你 state 里有嵌套结构时，每次更新都要逐层展开——这是不可变更新的代价
import React from "react"
import { create } from "zustand"

interface Comment {
  id: number
  text: string
  likes: number
}

interface BlogStore {
  post: {
    title: string
    author: {
      name: string
      avatar: string
    }
  }
  comments: Comment[]
  updateTitle: (title: string) => void
  updateAuthorName: (name: string) => void
  addComment: (text: string) => void
  likeComment: (id: number) => void
}

const useBlogStore = create<BlogStore>()((set) => ({
  post: {
    title: "Zustand 入门指南",
    author: { name: "张三", avatar: "👤" },
  },
  comments: [
    { id: 1, text: "写得很清晰！", likes: 5 },
    { id: 2, text: "希望更新更多内容", likes: 2 },
  ],
  // 嵌套对象更新：需要逐层展开
  updateTitle: (title) =>
    set((s) => ({ post: { ...s.post, title } })),
  updateAuthorName: (name) =>
    set((s) => ({
      post: { ...s.post, author: { ...s.post.author, name } },
    })),
  // 数组更新：map 返回新数组
  likeComment: (id) =>
    set((s) => ({
      comments: s.comments.map((c) =>
        c.id === id ? { ...c, likes: c.likes + 1 } : c,
      ),
    })),
  addComment: (text) =>
    set((s) => ({
      comments: [...s.comments, { id: Date.now(), text, likes: 0 }],
    })),
}))

export default function NestedUpdate() {
  const post = useBlogStore((s) => s.post)
  const comments = useBlogStore((s) => s.comments)
  const updateTitle = useBlogStore((s) => s.updateTitle)
  const updateAuthorName = useBlogStore((s) => s.updateAuthorName)
  const likeComment = useBlogStore((s) => s.likeComment)
  const addComment = useBlogStore((s) => s.addComment)

  const handleAddComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const input = e.currentTarget.elements.namedItem("comment") as HTMLInputElement
    if (input.value.trim()) {
      addComment(input.value.trim())
      input.value = ""
    }
  }

  return (
    <div className="space-y-3">
      {/* 文章信息 */}
      <div className="rounded bg-zinc-50 p-3 space-y-2">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={post.title}
            onChange={(e) => updateTitle(e.target.value)}
            className="flex-1 rounded border border-zinc-300 px-2 py-1 text-sm focus:border-blue-400 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-zinc-600">
          <span>{post.author.avatar}</span>
          <input
            type="text"
            value={post.author.name}
            onChange={(e) => updateAuthorName(e.target.value)}
            className="w-24 rounded border border-zinc-300 px-2 py-0.5 text-sm focus:border-blue-400 focus:outline-none"
          />
        </div>
      </div>

      {/* 评论列表 */}
      <div>
        <p className="mb-2 text-xs font-medium text-zinc-500">评论</p>
        <ul className="space-y-1 text-sm">
          {comments.map((c) => (
            <li key={c.id} className="flex items-center justify-between rounded bg-zinc-50 px-3 py-2">
              <span>{c.text}</span>
              <button
                onClick={() => likeComment(c.id)}
                className="rounded bg-pink-50 px-2 py-0.5 text-xs text-pink-500 hover:bg-pink-100"
              >
                👍 {c.likes}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* 添加评论 */}
      <form onSubmit={handleAddComment} className="flex gap-2">
        <input
          name="comment"
          type="text"
          placeholder="写评论..."
          className="flex-1 rounded border border-zinc-300 px-2 py-1 text-sm focus:border-blue-400 focus:outline-none"
        />
        <button className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600">
          发送
        </button>
      </form>
    </div>
  )
}

