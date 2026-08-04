// children 是 JSX 的重要概念：
// 和 HTML 一样，写在标签之间的内容会自动成为该元素的 children。
// React 内部通过 props.children 来访问这些「夹在中间」的内容。
export default function Demo() {
  const showContent = true
  return (
    <div>
      {/* ul 的 children 是三个 li */}
      <ul>
        <li>学习 JSX 语法</li>
        <li>理解 children 概念</li>
        <li>掌握元素组合</li>
      </ul>

      {/* p 的 children 可以是表达式计算的结果 */}
      <p style={{ color: 'green' }}>
        {showContent ? '内容可见' : '内容隐藏'}
      </p>
    </div>
  )
}
