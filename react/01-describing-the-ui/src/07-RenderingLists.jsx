// 用 map 把「数据数组」映射成「一组组件」。
// key 为什么必须？React 重渲染时用 key 识别“哪个元素是原来的那个”，
// 从而只更新变化项、复用不变项。不要用数组下标当 key（增删时会错乱）。
const people = [
  { id: 1, name: 'Ada' },
  { id: 2, name: 'Alan' },
  { id: 3, name: 'Grace' },
]

export default function Demo() {
  return (
    <ul>
      {people.map((p) => (
        <li key={p.id}>{p.name}</li>
      ))}
    </ul>
  )
}
