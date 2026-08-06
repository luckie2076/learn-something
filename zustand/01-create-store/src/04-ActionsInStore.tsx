// Action 就是 Store 里的方法——它们可以直接修改 Store 中的状态
// Zustand 不对 action 和 state 做区分，两者都是 store 里的普通属性
import { create } from "zustand"

interface Todo {
  id: number
  text: string
  done: boolean
}

interface TodoStore {
  todos: Todo[]
  // Action：添加待办事项
  addTodo: (text: string) => void
  // Action：切换完成状态
  toggleTodo: (id: number) => void
  // Action：删除待办事项
  removeTodo: (id: number) => void
}

const useTodoStore = create<TodoStore>()((set) => ({
  todos: [],
  // Action 内部调用 set 来更新状态
  addTodo: (text) =>
    set((state) => ({
      todos: [...state.todos, { id: Date.now(), text, done: false }],
    })),
  toggleTodo: (id) =>
    set((state) => ({
      todos: state.todos.map((t) =>
        t.id === id ? { ...t, done: !t.done } : t,
      ),
    })),
  removeTodo: (id) =>
    set((state) => ({
      todos: state.todos.filter((t) => t.id !== id),
    })),
}))

export default function ActionsInStore() {
  const todos = useTodoStore((s) => s.todos)
  const addTodo = useTodoStore((s) => s.addTodo)
  const toggleTodo = useTodoStore((s) => s.toggleTodo)
  const removeTodo = useTodoStore((s) => s.removeTodo)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const input = form.elements.namedItem("todo") as HTMLInputElement
    if (input.value.trim()) {
      addTodo(input.value.trim())
      input.value = ""
    }
  }

  return (
    <div className="space-y-3">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          name="todo"
          type="text"
          placeholder="输入待办事项..."
          className="flex-1 rounded border border-zinc-300 px-2 py-1 text-sm focus:border-blue-400 focus:outline-none"
        />
        <button
          type="submit"
          className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600 transition-colors"
        >
          添加
        </button>
      </form>
      {todos.length === 0 ? (
        <p className="text-sm text-zinc-400">暂无待办事项</p>
      ) : (
        <ul className="space-y-1">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center gap-2 rounded bg-zinc-50 px-3 py-2"
            >
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleTodo(todo.id)}
                className="h-4 w-4"
              />
              <span
                className={`flex-1 text-sm ${todo.done ? "line-through text-zinc-400" : ""}`}
              >
                {todo.text}
              </span>
              <button
                onClick={() => removeTodo(todo.id)}
                className="text-sm text-red-400 hover:text-red-600 transition-colors"
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
