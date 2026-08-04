import { useState } from 'react'

// 一次 UI 更新经历三个阶段：
// 1) 触发(Trigger)：事件或 setState 请求一次渲染
// 2) 渲染(Render) ：React 调用组件函数，算出新的 JSX
// 3) 提交(Commit) ：React 把变化应用到真实 DOM，屏幕才更新
// 你写的代码都在“触发”和“渲染”阶段；DOM 操作交给 React 在“提交”阶段完成。
export default function Demo() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <p>已提交到屏幕的数字：{count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  )
}
