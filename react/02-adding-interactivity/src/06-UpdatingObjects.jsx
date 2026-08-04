import { useState } from 'react'

// state 里的对象要「不可变」地更新：不能直接改，要创建副本再改。
// 为什么？React 用 Object.is 比较新旧 state 决定是否重渲染；
// 直接改原对象，引用没变，React 以为“没变”就不会更新 UI。
export default function Demo() {
  const [person, setPerson] = useState({ name: 'Lin', city: 'Beijing' })
  function handleMove() {
    setPerson({ ...person, city: 'Shanghai' }) // ✅ 展开创建新对象
  }
  return (
    <div>
      <p>{person.name} 住在 {person.city}</p>
      <button onClick={handleMove}>搬去上海</button>
    </div>
  )
}
