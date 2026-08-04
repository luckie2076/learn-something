// 事件：在 JSX 里用 onXxx 形式（小驼峰）挂处理函数。
// 为什么用 onClick 而不是 onclick？JSX 属性本质是 JS 标识符，按 JS 习惯用小驼峰。
export default function Demo() {
  function handleClick() {
    alert('你点了一下')
  }
  return <button onClick={handleClick}>点我</button>
}
