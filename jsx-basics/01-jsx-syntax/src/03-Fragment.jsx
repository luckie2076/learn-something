// Fragment（<></>）的作用：
// 当你不想要多余的 <div> 包裹层时，用空标签 <></> 包裹多个元素。
// React 渲染时不会在 DOM 中产生额外的节点。
export default function Demo() {
  return (
    <>
      <li>项目 A</li>
      <li>项目 B</li>
      <li>项目 C</li>
    </>
  )
}
