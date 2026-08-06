// Selector 的核心价值：在读取时做计算（派生数据），而不需要单独存一个字段
// 好处：store 保持精简，派生逻辑集中管理
import { create } from "zustand"

interface Todo {
  id: number
  text: string
  done: boolean
}

interface TodoStore {
  todos: Todo[]
  addTodo: (text: string) => void
  toggleTodo: (id: number) => void
}

const useTodoStore = create<TodoStore>()((set) => ({
  todos: [
    { id: 1, text: "学习 Zustand", done: true },
    { id: 2, text: "完成项目", done: false },
    { id: 3, text: "写单元测试", done: false },
  ],
  addTodo: (text) =>
    set((s) => ({
      todos: [...s.todos, { id: Date.now(), text, done: false }],
    })),
  toggleTodo: (id) =>
    set((s) => ({
      todos: s.todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    })),
}))

export default function DerivedData() {
  // ✅ 派生数据：在 selector 中直接从原始数据计算
  const doneCount = useTodoStore((s) => s.todos.filter((t) => t.done).length)
  const pendingCount = useTodoStore((s) => s.todos.filter((t) => !t.done).length)
  // ✅ 更进一步：甚至连百分比都可以在 selector 里算
  const progressPercent = useTodoStore((s) => {
    if (s.todos.length === 0) return 0
    return Math.round(
      (s.todos.filter((t) => t.done).length / s.todos.length) * 100,
    )
  })
  const todos = useTodoStore((s) => s.todos)
  const toggleTodo = useTodoStore((s) => s.toggleTodo)

  // 思考：为什么不把 doneCount、pendingCount 存到 store 里？
  // 答：因为它们由 todos 完全决定——多存一份就多一份「同步」的维护成本。
  //   selector 里按需计算 = 单一数据源 + 零维护。

  return (
    <div className="space-y-3">
      <ul className="divide-y divide-zinc-100 text-sm">
        {todos.map((todo) => (
          <li key={todo.id} className="flex items-center gap-2 py-1">
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => toggleTodo(todo.id)}
              className="h-4 w-4"
            />
            <span
              className={todo.done ? "line-through text-zinc-400" : ""}
            >
              {todo.text}
            </span>
          </li>
        ))}
      </ul>
      <div className="flex gap-4 text-sm">
        <span className="text-green-600">已完成 {doneCount}</span>
        <span className="text-orange-600">待处理 {pendingCount}</span>
        <span className="text-blue-600 font-medium">
          进度 {progressPercent}%
        </span>
      </div>
    </div>
  )
}
