import { useState } from 'react'

// useState 给组件一个“记忆”：组件再次渲染时，这个值被保留下来。
// 语法：const [state, setState] = useState(初始值)
// 为什么需要它？普通局部变量在重渲染后会丢失；useState 的值由 React 替你保存。
export default function Demo() {
  const [count, setCount] = useState(0)
  return (
    <button onClick={() => setCount(count + 1)}>
      点了 {count} 次
    </button>
  )
}
