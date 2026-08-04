import { useRef, useState } from 'react'

// useRef 返回一个“容器” { current }，它跨渲染保留，
// 但修改 ref.current 不会触发重新渲染（这是和 state 的关键区别）。
// 适合保存「不影响渲染输出」的值，如定时器 ID、上一次的值。
export default function Demo() {
  const countRef = useRef(0)
  const [show, setShow] = useState(0)

  function handleClick() {
    countRef.current += 1
    setShow((s) => s + 1) // 仅为了把 ref 里的最新值显示出来
  }
  return (
    <div>
      <p>点击次数（存在 ref 里）：{countRef.current}</p>
      <button onClick={handleClick}>点我</button>
    </div>
  )
}
