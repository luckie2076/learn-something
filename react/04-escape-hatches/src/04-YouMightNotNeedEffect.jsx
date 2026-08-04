import { useState } from 'react'

// 反例：用 useEffect 把“可由 props/state 算出”的东西塞进另一个 state（多余且有时序 bug）。
// 正例：直接「在渲染时计算」派生值，更简单、永远最新。
const all = ['Apple', 'Banana', 'Cherry']
export default function Demo() {
  const [query, setQuery] = useState('')
  const filtered = all.filter((f) => f.toLowerCase().includes(query.toLowerCase())) // ✅ 渲染时算
  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="过滤水果" />
      <ul>{filtered.map((f) => <li key={f}>{f}</li>)}</ul>
    </div>
  )
}
