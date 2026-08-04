// JSX 中的 style 属性不接收字符串，而是接收一个 JS 对象。
// 为什么？因为 React 用 JS 对象来描述样式更灵活，可以动态计算。
// 注意：
// 1. 外层 {} 是 JSX 表达式语法，内层 {} 是 JS 对象字面量 → 所以有 {{}}
// 2. CSS 属性名用 camelCase（驼峰），如 backgroundColor 而非 background-color
const cardStyle = {
  backgroundColor: '#f0f8ff',
  padding: 16,
  borderRadius: 8,
  border: '2px solid #007acc',
}

const isImportant = true

export default function Demo() {
  return (
    <div>
      <div style={cardStyle}>
        <p style={{ fontSize: 18, fontWeight: 'bold', color: '#007acc' }}>这是一条消息</p>
      </div>
      <p style={{ color: isImportant ? 'red' : 'gray', marginTop: 8 }}>
        {isImportant ? '重要提示' : '普通提示'}
      </p>
    </div>
  )
}
