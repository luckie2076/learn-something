// devtools 中间件：让 Redux DevTools 可以追踪 Zustand 的状态变化
// 这对开发和调试非常有用——可以看到状态如何随时间变化
import React from "react"
import { create } from "zustand"
import { devtools } from "zustand/middleware"

// devtools 中间件包裹 create，第二个参数是 DevTools 中显示的名字
interface TodoStore {
  todos: Array<{ id: number; text: string; done: boolean }>
  addTodo: (text: string) => void
  toggleTodo: (id: number) => void
  removeTodo: (id: number) => void
}

const useTodoStore = create<TodoStore>()(
  devtools(
    (set) => ({
      todos: [],
      addTodo: (text) =>
        set(
          (s) => ({
            todos: [...s.todos, { id: Date.now(), text, done: false }],
          }),
          false,
          "addTodo", // 👈 Action 名称——在 DevTools 中会显示
        ),
      toggleTodo: (id) =>
        set(
          (s) => ({
            todos: s.todos.map((t) =>
              t.id === id ? { ...t, done: !t.done } : t,
            ),
          }),
          false,
          "toggleTodo",
        ),
      removeTodo: (id) =>
        set(
          (s) => ({
            todos: s.todos.filter((t) => t.id !== id),
          }),
          false,
          "removeTodo",
        ),
    }),
    { name: "Todo Store" }, // DevTools 中的 store 显示名
  ),
)

export default function Devtools() {
  const todos = useTodoStore((s) => s.todos)
  const addTodo = useTodoStore((s) => s.addTodo)
  const toggleTodo = useTodoStore((s) => s.toggleTodo)
  const removeTodo = useTodoStore((s) => s.removeTodo)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const input = e.currentTarget.elements.namedItem("todo") as HTMLInputElement
    if (input.value.trim()) {
      addTodo(input.value.trim())
      input.value = ""
    }
  }

  return (
    <div className="space-y-3">
      <div className="rounded bg-blue-50 p-3 text-xs text-blue-600">
        💡 打开浏览器 <strong>Redux DevTools</strong> 插件，可以看到每次操作的状态变化和时间旅行调试能力。
        如果没有安装插件，可以访问
        <a
          href="https://chromewebstore.google.com/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd"
          target="_blank"
          className="underline ml-1"
        >
          Chrome Web Store
        </a>
        安装。
      </div>
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
      {todos.length === 0 ? (
        <p className="text-sm text-zinc-400">暂无待办</p>
      ) : (
        <ul className="space-y-1">
          {todos.map((todo) => (
            <li key={todo.id} className="flex items-center gap-2 rounded bg-zinc-50 px-3 py-2">
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleTodo(todo.id)}
                className="h-4 w-4"
              />
              <span className={`flex-1 text-sm ${todo.done ? "line-through text-zinc-400" : ""}`}>
                {todo.text}
              </span>
              <button
                onClick={() => removeTodo(todo.id)}
                className="text-sm text-red-400 hover:text-red-600"
              >
                删除
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

