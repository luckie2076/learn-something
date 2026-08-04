// 用 Array.map() 把「数据数组」映射成「JSX 元素数组」。
//
// key 为什么必须？
// 想象数组在头部插入一项，所有下标全部后移：
//   旧: [{id:"a",name:"Apple"}, {id:"b",name:"Banana"}]
//   新: [{id:"x",name:"Xigua"}, {id:"a",name:"Apple"}, {id:"b",name:"Banana"}]
//
// 用 index 做 key：key=0 从 "Apple" 变成了 "Xigua"，React 以为 Apple 被修改了，
//   key=1 从 "Banana" 变成 "Apple"... 整个列表全部重渲染，白白浪费。
// 用 id 做 key：key="x" 是新增，key="a"/"b" 还在原位 → 只插入 1 个 DOM，其余复用。
//
// 更严重的情况：每个 item 里还有组件内部状态（输入框内容、勾选等），
// 用 index 会导致状态错乱——React 把旧 item 的状态给了新 item。禁止用 index 做 key。
const tasks = [
  { id: 1, title: '学习 JSX 语法', done: true },
  { id: 2, title: '理解条件渲染', done: false },
  { id: 3, title: '掌握列表渲染', done: false },
]

export default function Demo() {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id} style={{ color: task.done ? '#999' : '#333' }}>
          {task.done ? '✅' : '⬜'} {task.title}
        </li>
      ))}
    </ul>
  )
}
