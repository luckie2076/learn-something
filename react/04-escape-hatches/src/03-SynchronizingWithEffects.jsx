import { useState, useEffect } from 'react'

// Effect 在「渲染之后」运行，用来让组件与外部系统同步。
// 这里把内部状态同步到浏览器标签标题（一个 React 管不着的外部系统）。
export default function Demo() {
  const [count, setCount] = useState(0)
  useEffect(() => {
    document.title = `点击了 ${count} 次`
  }, [count]) // 依赖数组：count 变化时重新同步
  return <button onClick={() => setCount(count + 1)}>点我（看浏览器标题）</button>
}
