import { useState } from 'react'

function Chat({ recipient }) {
  const [draft, setDraft] = useState('')
  return (
    <div>
      <h4>与 {recipient} 聊天</h4>
      <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="输入消息" />
      <p>草稿：{draft}</p>
    </div>
  )
}

// 关键：切换聊天对象时，给 Chat 一个不同的 key。
// React 视其为「全新的组件实例」，于是丢掉旧 draft、重置为空——
// 这正是用 key 控制「状态保留还是重置」的机制。
export default function Demo() {
  const [who, setWho] = useState('Alice')
  return (
    <div>
      <button onClick={() => setWho('Alice')}>Alice</button>
      <button onClick={() => setWho('Bob')}>Bob</button>
      <Chat key={who} recipient={who} />
    </div>
  )
}
