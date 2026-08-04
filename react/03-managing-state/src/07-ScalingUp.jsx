import { createContext, useContext, useReducer, useState } from 'react'

const TasksContext = createContext(null)

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'add': return [...tasks, { id: Date.now(), text: action.text }]
    case 'del': return tasks.filter((t) => t.id !== action.id)
    default: return tasks
  }
}

// 进阶组合：用 reducer 管复杂状态，用 context 把「状态 + 派发」广播下去。
// 任意深度的子组件都能零 props 透传地读写任务——应用规模变大也不乱。
export default function Demo() {
  const [tasks, dispatch] = useReducer(tasksReducer, [])
  return (
    <TasksContext.Provider value={{ tasks, dispatch }}>
      <AddTask />
      <TaskList />
    </TasksContext.Provider>
  )
}

function AddTask() {
  const { dispatch } = useContext(TasksContext)
  const [text, setText] = useState('')
  function submit() {
    if (!text.trim()) return
    dispatch({ type: 'add', text })
    setText('')
  }
  return (
    <div>
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="新任务" />
      <button onClick={submit}>添加</button>
    </div>
  )
}

function TaskList() {
  const { tasks, dispatch } = useContext(TasksContext)
  return (
    <ul>
      {tasks.map((t) => (
        <li key={t.id}>
          {t.text} <button onClick={() => dispatch({ type: 'del', id: t.id })}>删</button>
        </li>
      ))}
    </ul>
  )
}
