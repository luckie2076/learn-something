import { useState } from 'react'

// 原则：state 里不要存「冗余 / 可由其他 state 推导」的数据。
// 反例：同时存 firstName、lastName、fullName —— fullName 可由前两者算出，
//        忘了同步就会前后矛盾。
// 正例：只存前两者，fullName 在渲染时计算（派生值）。
export default function Demo() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const fullName = `${firstName} ${lastName}`.trim() // 派生，不进 state
  return (
    <div>
      <input placeholder="名" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
      <input placeholder="姓" value={lastName} onChange={(e) => setLastName(e.target.value)} />
      <p>全名：{fullName || '（未填）'}</p>
    </div>
  )
}
