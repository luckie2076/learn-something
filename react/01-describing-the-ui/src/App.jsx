import S1 from './01-YourFirstComponent.jsx'
import S2 from './02-ImportExport.jsx'
import S3 from './03-WritingMarkup.jsx'
import S4 from './04-JSXWithBraces.jsx'
import S5 from './05-PassingProps.jsx'
import S6 from './06-ConditionalRendering.jsx'
import S7 from './07-RenderingLists.jsx'
import S8 from './08-KeepingPure.jsx'
import S9 from './09-UITree.jsx'

const sections = [
  [1, '你的第一个组件', S1],
  [2, '组件的导入与导出', S2],
  [3, '使用 JSX 书写标签语言', S3],
  [4, '在 JSX 中通过大括号使用 JavaScript', S4],
  [5, '将 Props 传递给组件', S5],
  [6, '条件渲染', S6],
  [7, '渲染列表', S7],
  [8, '保持组件纯粹', S8],
  [9, '将 UI 视为树', S9],
]

export default function App() {
  return (
    <div style={{ fontFamily: 'system-ui', maxWidth: 640, margin: '0 auto', padding: 16 }}>
      <h1>第一章 · 描述 UI</h1>
      {sections.map(([n, title, Comp]) => (
        <section key={n}>
          <h2>{n}. {title}</h2>
          <div style={{border: '1px solid gray', padding: '8px',}}>
            <Comp />
          </div>
        </section>
      ))}
    </div>
  )
}
