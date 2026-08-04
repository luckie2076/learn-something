import { createContext, useContext, useState } from 'react'

const ThemeContext = createContext(null)

function Toolbar() {
  // 深层组件直接读取，无需父辈一层层透传 props
  const theme = useContext(ThemeContext)
  return (
    <button style={{ background: theme === 'dark' ? '#333' : '#ccc', color: '#fff' }}>
      按钮
    </button>
  )
}

// Context 让父组件把数据「广播」给任意深度的子组件，
// 避免中间一堆组件被迫当“传话筒”。（注：它不替代状态本身，只解决“传递”问题。）
export default function Demo() {
  const [theme, setTheme] = useState('light')
  return (
    <ThemeContext.Provider value={theme}>
      <button onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}>
        切换主题（当前 {theme}）
      </button>
      <Toolbar />
    </ThemeContext.Provider>
  )
}
