// JSX 标签规则：
// 1. 标签必须闭合（像 <br /> 或 <img /> 这样的自闭合标签也必须加 /）
// 2. 组件 return 中必须有「单个根节点」——不能返回两个并列的顶层标签
export default function Demo() {
  // ❌ 错误：return <h1>标题</h1><p>段落</p>
  // ✅ 正确：用单个标签包裹
  return (
    <div>
      <h3>一个正确的组件</h3>
      <p>所有标签都正确闭合</p>
      <hr />
      <input type="text" placeholder="自闭合标签要有 /" />
    </div>
  )
}
