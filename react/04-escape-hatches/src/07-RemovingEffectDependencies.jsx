import { useState, useEffect } from 'react'

// 问题：effect 依赖一个「渲染时新建的对象」，每次渲染对象都不同，effect 就反复重跑。
// 解决：把对象/函数的创建「搬进 effect 内部」，依赖项就消失了。
// 注意：正确做法是重构代码，而不是粗暴改依赖数组去“骗”React。
function subscribe(options) {
  console.log('订阅', options)
  return () => console.log('取消订阅')
}

export default function Demo() {
  const [roomId, setRoomId] = useState('general')
  useEffect(() => {
    const options = { roomId, server: 'chat' } // ✅ 在 effect 内创建，非依赖
    const unsub = subscribe(options)
    return unsub
  }, [roomId]) // 只需 roomId
  return (
    <div>
      <button onClick={() => setRoomId('general')}>general</button>
      <button onClick={() => setRoomId('random')}>random</button>
      <p>房间 {roomId}</p>
    </div>
  )
}
