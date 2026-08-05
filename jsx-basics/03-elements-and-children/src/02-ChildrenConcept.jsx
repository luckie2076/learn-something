// children 是 JSX 的核心概念：
// 1. 写在标签之间的内容会自动成为该元素的 children（和 HTML 一样）
// 2. 组件可以通过 props.children 接收子元素，实现「容器模式」
//
// children 的类型取决于传递了几个子元素：
//   · 传 0 个 → undefined
//   · 传 1 个 → 单个 React 元素（如 <p>...</p>）
//   · 传多个 → React 元素数组（React 自动帮你组装成数组）

import { Children } from 'react'

// ====== 容器组件 + 揭示 children 的真实类型 ======
function Card({ title, children }) {
  const count = Children.count(children)
  const type = Array.isArray(children) ? '数组' : (children == null ? 'undefined' : '单个元素')

  return (
    <div style={{
      border: '1px solid #e0e0e0',
      borderRadius: 8,
      padding: 12,
      marginBottom: 12,
    }}>
      <h4 style={{ margin: '0 0 4px 0', color: '#333' }}>{title}</h4>
      <p style={{ fontSize: 13, color: '#888', margin: '0 0 8px 0' }}>
        children 类型: {type}，共 {count} 个子元素
      </p>
      {children}
    </div>
  )
}

// ====== 演示 ======
export default function Demo() {
  // 自己手动组装一个 JSX 元素数组，也可以直接渲染
  const manualList = [
    <li key="a">React 支持直接渲染 JSX 数组</li>,
    <li key="b">这就是 {`{items.map(...)}`} 能工作的原因</li>,
    <li key="c">每个元素都需要 key 属性</li>,
  ]

  return (
    <div>
      {/* 传 2 个子元素 → children 是数组 */}
      <Card title="多个子元素">
        <p>像 HTML 一样，标签间的内容就是 children</p>
        <ul style={{ margin: 0 }}>
          <li>学习 JSX 语法</li>
          <li>理解 children 概念</li>
        </ul>
      </Card>

      {/* 传 1 个子元素 → children 是单个 React 元素 */}
      <Card title="单个子元素">
        <p style={{ color: 'green', margin: 0 }}>
          只有一个子元素时，children 不是数组，就是它本身
        </p>
      </Card>

      {/* 手动创建的 JSX 数组，直接用 {} 渲染 */}
      <Card title="手动创建 JSX 数组并渲染">
        <ul style={{ margin: 0 }}>{manualList}</ul>
      </Card>
    </div>
  )
}
