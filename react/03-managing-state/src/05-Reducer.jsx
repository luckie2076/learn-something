import { useReducer } from 'react'

// 当事件处理里要更新多个 state、或更新逻辑变复杂时，
// 把「怎么变」收拢进一个 reducer 函数，事件只派发「动作(action)」。
// 好处：更新逻辑集中、易测试、组件更清爽。
function reducer(count, action) {
  switch (action.type) {
    case 'inc': return count + 1
    case 'dec': return count - 1
    case 'reset': return 0
    default: return count
  }
}

export default function Demo() {
  const [count, dispatch] = useReducer(reducer, 0)
  return (
    <div>
      <p>计数：{count}</p>
      <button onClick={() => dispatch({ type: 'dec' })}>-</button>
      <button onClick={() => dispatch({ type: 'inc' })}>+</button>
      <button onClick={() => dispatch({ type: 'reset' })}>重置</button>
    </div>
  )
}
