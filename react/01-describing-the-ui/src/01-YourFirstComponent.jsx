// 组件就是「返回标签的 JavaScript 函数」。
// 为什么是函数？因为 React 的核心思想是声明式：你描述 UI“长什么样”，
// 而不是一步步命令它“怎么变”。函数天然适合做这件事——输入即 props，输出即 UI。
export default function Profile() {
  return (
    <div style={{ border: '1px solid #ccc', padding: 12, borderRadius: 8, display: 'inline-block' }}>
      <h3>Katherine Johnson</h3>
      <p>数学家，NASA 太空计划先驱</p>
    </div>
  )
}
