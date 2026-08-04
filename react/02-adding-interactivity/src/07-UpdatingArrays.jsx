import { useState } from 'react'

// 数组同样当作只读：用 map / filter / [...arr, x] 等“返回新数组”的方式更新。
const initial = [{ id: 1, text: '学 React' }]

export default function Demo() {
  const [items, setItems] = useState(initial)
  function add() {
    setItems([...items, { id: Date.now(), text: '新事项' }]) // ✅ 新数组
  }
  function remove(id) {
    setItems(items.filter((i) => i.id !== id)) // ✅ 新数组
  }
  return (
    <div>
      <ul>
        {items.map((i) => (
          <li key={i.id}>
            {i.text} <button onClick={() => remove(i.id)}>删</button>
          </li>
        ))}
      </ul>
      <button onClick={add}>添加</button>
    </div>
  )
}
