import S1 from './01-ReactingToInput.jsx'
import S2 from './02-ChoosingStateStructure.jsx'
import S3 from './03-SharingState.jsx'
import S4 from './04-PreservingAndResettingState.jsx'
import S5 from './05-Reducer.jsx'
import S6 from './06-Context.jsx'
import S7 from './07-ScalingUp.jsx'
import S8 from './08-CompoundComponents.jsx'

const sections = [
  [1, '用 State 响应输入', S1],
  [2, '选择 State 结构', S2],
  [3, '在组件间共享状态', S3],
  [4, '对 State 进行保留和重置', S4],
  [5, '迁移状态逻辑至 Reducer', S5],
  [6, '使用 Context 深层传递参数', S6],
  [7, '使用 Reducer 和 Context 拓展你的应用', S7],
  [8, '复合组件 — Context 的设计模式应用', S8],
]

export default function App() {
  return (
    <div style={{ fontFamily: 'system-ui', maxWidth: 640, margin: '0 auto', padding: 16 }}>
      <h1>第三章 · 管理状态</h1>
      {sections.map(([n, title, Comp]) => (
        <section key={n} style={{ borderTop: '1px solid #eee', padding: '12px 0' }}>
          <h2>{n}. {title}</h2>
          <Comp />
        </section>
      ))}
    </div>
  )
}
