// JSX 元素可以像 HTML 一样嵌套，形成「树状」结构。
// 写在标签之间的内容会自动成为该元素的 children。
// 这种树状嵌套让 UI 结构一目了然。
export default function Demo() {
  return (
    <div style={{ border: '1px solid #ccc', padding: 12 }}>
      <h4>卡片标题</h4>
      <p>卡片的描述文字</p>
      <div style={{ display: 'flex', gap: 8 }}>
        <span>标签1</span>
        <span>标签2</span>
        <span>标签3</span>
      </div>
    </div>
  )
}
