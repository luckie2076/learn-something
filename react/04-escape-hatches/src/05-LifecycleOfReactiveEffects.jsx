import { useState, useEffect } from 'react'

// 响应式 Effect 的“生命周期”不同于组件的挂载/卸载：
// 它按需「开始同步 / 停止同步」。依赖(roomId)变了，先停掉旧的，再开始新的。
function connect(roomId) {
  console.log(`连接到房间 ${roomId}`)
  return () => console.log(`离开房间 ${roomId}`)
}

export default function Demo() {
  const [roomId, setRoomId] = useState('general')
  useEffect(() => {
    const disconnect = connect(roomId)
    return disconnect // 清理函数：下次同步前 / 卸载时调用
  }, [roomId])
  return (
    <div>
      <button onClick={() => setRoomId('general')}>general</button>
      <button onClick={() => setRoomId('random')}>random</button>
      <p>当前房间：{roomId}（切换看控制台）</p>
    </div>
  )
}
