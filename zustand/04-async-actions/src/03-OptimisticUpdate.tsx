// 乐观更新（Optimistic Update）：先更新 UI，再请求服务器
// 如果请求失败，回滚状态
// 这种模式让用户感觉"秒响应"，大幅提升体验
import React from "react"
import { create } from "zustand"

interface Todo {
  id: number
  text: string
  completed: boolean
}

interface TodoStore {
  todos: Todo[]
  // 乐观添加
  addTodoOptimistic: (text: string) => Promise<void>
  // 乐观切换
  toggleTodoOptimistic: (id: number) => Promise<void>
}

// 模拟 API：60% 概率成功，40% 概率失败
async function mockApi<T>(data: T): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, 800))
  if (Math.random() < 0.4) {
    throw new Error("服务器繁忙，请重试")
  }
  return data
}

const useTodoStore = create<TodoStore>()((set, get) => ({
  todos: [
    { id: 1, text: "了解乐观更新", completed: false },
    { id: 2, text: "实现回滚逻辑", completed: true },
  ],
  addTodoOptimistic: async (text) => {
    const tempId = -Date.now() // 用负数作为临时 ID，避免和真实 ID 冲突
    const newTodo = { id: tempId, text, completed: false }

    // 步骤 1：立即更新 UI（乐观假设请求会成功）
    const previousTodos = get().todos
    set({ todos: [...previousTodos, newTodo] })

    try {
      // 步骤 2：真正调用 API
      const result = await mockApi({ id: Date.now(), text, completed: false })
      // 步骤 3：用服务器返回的真实数据替换临时数据
      set((state) => ({
        todos: state.todos.map((t) =>
          t.id === tempId ? result : t,
        ),
      }))
    } catch {
      // 步骤 4：请求失败 → 回滚到之前的状态
      set({ todos: previousTodos })
      alert("添加失败，已回滚！")
    }
  },
  toggleTodoOptimistic: async (id) => {
    const previousTodos = get().todos

    // 乐观切换：立即改变 UI
    set({
      todos: previousTodos.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t,
      ),
    })

    try {
      await mockApi({ ok: true })
    } catch {
      // 回滚
      set({ todos: previousTodos })
      alert("操作失败，已回滚！")
    }
  },
}))

export default function OptimisticUpdate() {
  const todos = useTodoStore((s) => s.todos)
  const addTodoOptimistic = useTodoStore((s) => s.addTodoOptimistic)
  const toggleTodoOptimistic = useTodoStore((s) => s.toggleTodoOptimistic)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const input = e.currentTarget.elements.namedItem("todo") as HTMLInputElement
    if (input.value.trim()) {
      await addTodoOptimistic(input.value.trim())
      input.value = ""
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-zinc-400">
        演示乐观更新：操作立即生效，API 失败时自动回滚（40% 概率触发回滚）
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          name="todo"
          type="text"
          placeholder="输入待办..."
          className="flex-1 rounded border border-zinc-300 px-2 py-1 text-sm focus:border-blue-400 focus:outline-none"
        />
        <button className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600">
          添加
        </button>
      </form>
      <ul className="space-y-1">
        {todos.map((todo) => (
          <li key={todo.id} className="flex items-center gap-2 rounded bg-zinc-50 px-3 py-2 text-sm">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodoOptimistic(todo.id)}
              className="h-4 w-4"
            />
            <span
              className={
                todo.completed ? "line-through text-zinc-400" : ""
              }
            >
              {todo.text}
            </span>
            {todo.id < 0 && (
              <span className="text-xs text-orange-500 animate-pulse">
                （同步中...）
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

