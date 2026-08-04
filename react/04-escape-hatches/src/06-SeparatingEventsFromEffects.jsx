import { useState, useEffect, useEffectEvent } from 'react'

// useEffectEvent 把「非响应式」的代码从 Effect 里摘出来：
// Effect 只因 roomId 变化而重新同步；读 theme 不会触发重新同步。
function connect(roomId, theme) {
  console.log(`连接 ${roomId}，主题 ${theme}`)
  return () => console.log(`断开 ${roomId}`)
}

export default function Demo() {
  const [roomId, setRoomId] = useState('general')
  const [theme, setTheme] = useState('light')

  // 事件：里面读 theme，但不进入依赖数组
  const onConnected = useEffectEvent(() => theme)

  useEffect(() => {
    const disconnect = connect(roomId, onConnected())
    return disconnect
  }, [roomId]) // 只依赖 roomId

  return (
    <div>
      <button onClick={() => setRoomId('general')}>general</button>
      <button onClick={() => setRoomId('random')}>random</button>
      <button onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}>
        切主题（不重连）
      </button>
      <p>房间 {roomId} / 主题 {theme}</p>
    </div>
  )
}
