import S1 from './01-RespondingToEvents.jsx'
import S2 from './02-StateMemory.jsx'
import S3 from './03-RenderAndCommit.jsx'
import S4 from './04-StateAsSnapshot.jsx'
import S5 from './05-QueueingUpdates.jsx'
import S6 from './06-UpdatingObjects.jsx'
import S7 from './07-UpdatingArrays.jsx'

const sections = [
  [1, '响应事件', S1],
  [2, 'State: 组件的记忆', S2],
  [3, '渲染和提交', S3],
  [4, 'state 如同一张快照', S4],
  [5, '把一系列 state 更新加入队列', S5],
  [6, '更新 state 中的对象', S6],
  [7, '更新 state 中的数组', S7],
]

export default function App() {
  return (
    <div style={{ fontFamily: 'system-ui', maxWidth: 640, margin: '0 auto', padding: 16 }}>
      <h1>第二章 · 添加交互</h1>
      {sections.map(([n, title, Comp]) => (
        <section key={n} style={{ borderTop: '1px solid #eee', padding: '12px 0' }}>
          <h2>{n}. {title}</h2>
          <Comp />
        </section>
      ))}
    </div>
  )
}
