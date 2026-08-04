import { useRef } from 'react'

// 偶尔需要直接碰 DOM（聚焦、滚动、测量尺寸）——这是 React 给你的“脱围”口子。
// ref 挂到 JSX 上，React 会把它指向对应的真实 DOM 节点。
export default function Demo() {
  const inputRef = useRef(null)
  function focus() {
    inputRef.current.focus()
  }
  return (
    <div>
      <input ref={inputRef} placeholder="点按钮聚焦我" />
      <button onClick={focus}>聚焦输入框</button>
    </div>
  )
}
