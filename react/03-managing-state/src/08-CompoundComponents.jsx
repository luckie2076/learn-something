import { createContext, useContext, useState } from 'react'

// 复合组件（Compound Components）模式：
// 父组件持有状态，通过 Context 隐式地广播给所有子组件。
// 调用方只需声明式地「组装」标签，无需手动传 props 管线。
// 这本质上是第 6、7 节 Context 知识的一个具体设计模式。

const TabsContext = createContext(null)

// ====== 容器：持有 activeIndex，通过 Context 广播 ======
function Tabs({ children }) {
  const [activeIndex, setActiveIndex] = useState(0)
  return (
    <TabsContext.Provider value={{ activeIndex, setActiveIndex }}>
      <div>{children}</div>
    </TabsContext.Provider>
  )
}

// ====== 标签按钮组（纯视觉容器，不读 Context） ======
function TabList({ children }) {
  return <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>{children}</div>
}

// ====== 单个标签：从 Context 读取 activeIndex，决定高亮 ======
function Tab({ index, children }) {
  const { activeIndex, setActiveIndex } = useContext(TabsContext)
  return (
    <button
      onClick={() => setActiveIndex(index)}
      style={{
        padding: '6px 16px',
        border: 'none',
        borderBottom: activeIndex === index ? '2px solid #333' : '2px solid transparent',
        background: activeIndex === index ? '#eee' : 'transparent',
        cursor: 'pointer',
        fontWeight: activeIndex === index ? 'bold' : 'normal',
      }}
    >
      {children}
    </button>
  )
}

// ====== 面板：同样从 Context 读取，只渲染激活的那个 ======
function TabPanel({ index, children }) {
  const { activeIndex } = useContext(TabsContext)
  if (activeIndex !== index) return null
  return <div style={{ padding: 12, background: '#f9f9f9', borderRadius: 4 }}>{children}</div>
}

// JS 中函数也是对象，可以像对象一样添加属性。
// 把子组件挂到 Tabs 上，形成 <Tabs.Tab> 命名空间式 API。
// React 核心也是这么干的：React.Fragment、React.StrictMode 等同理。
Tabs.TabList = TabList
Tabs.Tab = Tab
Tabs.TabPanel = TabPanel

// 注：真实项目通常会把子组件分别 export，调用方按需导入：
//   import { Tabs, Tab, TabPanel } from './Tabs'
// 本文件为教学演示，一切放在同一文件内。

// ====== 演示：调用方只需声明式组合，零 props 透传 ======
export default function Demo() {
  return (
    <Tabs>
      <Tabs.TabList>
        <Tabs.Tab index={0}>标签一</Tabs.Tab>
        <Tabs.Tab index={1}>标签二</Tabs.Tab>
        <Tabs.Tab index={2}>标签三</Tabs.Tab>
      </Tabs.TabList>
      <Tabs.TabPanel index={0}>这是第一个标签的内容</Tabs.TabPanel>
      <Tabs.TabPanel index={1}>第二个标签也很有意思</Tabs.TabPanel>
      <Tabs.TabPanel index={2}>第三个标签的内容在这里</Tabs.TabPanel>
    </Tabs>
  )
}
