// React 组件 return 中必须返回「单个根节点」。
// 需要返回多个并列元素时，有两种方式：
// 1. 用 <div> 包裹 —— 会在 DOM 中多一层节点
// 2. 用 Fragment（<></>）包裹 —— 渲染时「隐身」，不产生额外 DOM 节点
export default function Demo() {
  return (
    <>
      <h4>使用 Fragment 的好处</h4>
      <p>Fragment 不产生多余的 DOM 节点</p>
      <p>适合在不破坏布局的情况下组合多个元素</p>
    </>
  )
}
