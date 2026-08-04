// 用大括号 {} 在 JSX 里嵌入任意 JavaScript 表达式。
// 两处可用：标签「内容」里，以及标签「属性」里。
const name = 'Josh'
const age = 42

export default function Demo() {
  return (
    <div>
      <h3>{name} 的档案</h3>          {/* 内容里用 {} */}
      <p>年龄：{age}</p>
      <div
        style={{ width: 100, height: 100, borderRadius: '50%', background: '#888' }}  // 属性里用 {}
        title={`${name} 的头像`}        // 模板字符串也可以
      />
    </div>
  )
}
