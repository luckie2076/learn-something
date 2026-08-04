import { useState, useEffect } from 'react'

// 自定义 Hook：把「带状态的逻辑」封装成函数（命名以 use 开头），
// 多个组件即可复用，而不必各自写一遍 Effect。
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth)
  useEffect(() => {
    function onResize() {
      setWidth(window.innerWidth)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return width
}

function Box() {
  const width = useWindowWidth()
  return <p>窗口宽度：{width}px（缩放窗口试试）</p>
}

export default function Demo() {
  return <Box />
}
