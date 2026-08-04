import { useState } from 'react'

// 关键认知：state 像「快照」。
// 调用 setCount 不会立刻改变当前作用域里的 count，而是“请求”用新值重新渲染。
// 所以在同一个事件处理函数里连续读 count，拿到的仍是本次渲染的那张旧快照。
export default function Demo() {
  const [count, setCount] = useState(0)
  function handleClick() {
    setCount(count + 1)
    // 这里读到的 count 还是旧值，因为本次渲染的快照没变
    console.log('点击瞬间看到的 count =', count)
  }
  return (
    <button onClick={handleClick}>
      点我（看控制台：count 仍是 {count}）
    </button>
  )
}
