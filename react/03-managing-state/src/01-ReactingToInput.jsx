import { useState } from 'react'

// 思维转变：不要「命令式」地操作 UI（比如手动去禁用按钮），
// 而是描述组件在「不同状态」下长什么样，再由用户输入改变状态。
export default function Demo() {
  const [text, setText] = useState('')
  const isEmpty = text.trim() === ''
  return (
    <div>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="写点什么"
      />
      <button disabled={isEmpty}>提交</button>
      <p>状态：{isEmpty ? '空' : '已填写'}</p>
    </div>
  )
}
