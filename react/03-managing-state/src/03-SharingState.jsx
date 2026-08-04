import { useState } from 'react'

function CelsiusInput({ value, onChange }) {
  return <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="摄氏度" />
}
function FahrenheitDisplay({ celsius }) {
  const f = celsius === '' ? '' : (Number(celsius) * 9) / 5 + 32
  return <p>华氏：{f}</p>
}

// 共享状态（状态提升）：当两个组件需要同步时，把 state 移到「最近的公共父组件」，
// 再通过 props 下发。这样「唯一真相」只在父组件一处，两个子组件永远同步。
export default function Demo() {
  const [celsius, setCelsius] = useState('')
  return (
    <div>
      <CelsiusInput value={celsius} onChange={setCelsius} />
      <FahrenheitDisplay celsius={celsius} />
    </div>
  )
}
