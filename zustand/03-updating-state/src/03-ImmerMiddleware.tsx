// immer middleware：让你用"直接修改"的方式写不可变更新
// 对于深层嵌套的数据，逐层展开很痛苦——immer 让 set 变得像普通 mutating 代码
import { create } from "zustand"
import { immer } from "zustand/middleware/immer"

interface Task {
  id: number
  title: string
  assignee: { name: string; department: string }
  tags: string[]
  done: boolean
}

interface TaskStore {
  tasks: Task[]
  addTask: (title: string) => void
  toggleDone: (id: number) => void
  // 更新深层嵌套字段——用 immer 后直接赋值即可
  updateAssigneeName: (taskId: number, name: string) => void
  updateDepartment: (taskId: number, dep: string) => void
  addTag: (taskId: number, tag: string) => void
}

// 用 immer() 包裹 create，之后 set 里就可以"直接修改"了
const useTaskStore = create<TaskStore>()(
  immer((set) => ({
    tasks: [
      {
        id: 1,
        title: "设计首页",
        assignee: { name: "张三", department: "前端组" },
        tags: ["UI", "React"],
        done: false,
      },
      {
        id: 2,
        title: "接入支付",
        assignee: { name: "李四", department: "后端组" },
        tags: ["API"],
        done: false,
      },
    ],
    // immer 让数组操作和直接 mutating 一样自然
    addTask: (title) =>
      set((s) => {
        s.tasks.push({
          id: Date.now(),
          title,
          assignee: { name: "未分配", department: "待定" },
          tags: [],
          done: false,
        })
      }),
    toggleDone: (id) =>
      set((s) => {
        const task = s.tasks.find((t) => t.id === id)
        if (task) task.done = !task.done
      }),
    // 深层嵌套更新：用 immer 后直接赋值，不需要逐层展开
    updateAssigneeName: (taskId, name) =>
      set((s) => {
        const task = s.tasks.find((t) => t.id === taskId)
        if (task) task.assignee.name = name
      }),
    updateDepartment: (taskId, dep) =>
      set((s) => {
        const task = s.tasks.find((t) => t.id === taskId)
        if (task) task.assignee.department = dep
      }),
    addTag: (taskId, tag) =>
      set((s) => {
        const task = s.tasks.find((t) => t.id === taskId)
        if (task && !task.tags.includes(tag)) task.tags.push(tag)
      }),
  })),
)

export default function ImmerMiddleware() {
  const tasks = useTaskStore((s) => s.tasks)
  const toggleDone = useTaskStore((s) => s.toggleDone)
  const updateAssigneeName = useTaskStore((s) => s.updateAssigneeName)
  const updateDepartment = useTaskStore((s) => s.updateDepartment)

  return (
    <div className="space-y-2">
      <p className="text-xs text-zinc-400 mb-2">
        使用 immer 中间件后，set 里的代码可以像普通 mutating 一样写，immer 自动生成不可变新对象
      </p>
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`rounded border p-3 text-sm ${task.done ? "border-green-200 bg-green-50" : "border-zinc-200"}`}
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => toggleDone(task.id)}
                className="h-4 w-4"
              />
              <span className={`font-medium ${task.done ? "line-through text-zinc-400" : ""}`}>
                {task.title}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-1">
                <span className="text-zinc-400">负责人：</span>
                <input
                  value={task.assignee.name}
                  onChange={(e) => updateAssigneeName(task.id, e.target.value)}
                  className="w-16 rounded border border-zinc-300 px-1 py-0.5"
                />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-zinc-400">部门：</span>
                <input
                  value={task.assignee.department}
                  onChange={(e) => updateDepartment(task.id, e.target.value)}
                  className="w-20 rounded border border-zinc-300 px-1 py-0.5"
                />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-zinc-400">标签：</span>
                {task.tags.map((t) => (
                  <span key={t} className="rounded bg-blue-100 px-1 text-blue-600">{t}</span>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
