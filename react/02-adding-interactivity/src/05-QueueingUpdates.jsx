import { useState } from 'react'

// 连续三次 setCount(count + 1) 只会 +1，因为三次用的都是同一张快照里的 count。
// 解决：用「更新函数」setCount(c => c + 1)，React 会把它们排队，
// 依次基于上一次的结果计算——最终 +3。
export default function Demo() {
  const [count, setCount] = useState(0)
  function handleClick() {
    setCount((c) => c + 1)
    setCount((c) => c + 1)
    setCount((c) => c + 1)
  }
  return <button onClick={handleClick}>连点 +3（当前 {count}）</button>
}
