import S1 from './01-ReferencingValues.jsx'
import S2 from './02-ManipulatingDOM.jsx'
import S3 from './03-SynchronizingWithEffects.jsx'
import S4 from './04-YouMightNotNeedEffect.jsx'
import S5 from './05-LifecycleOfReactiveEffects.jsx'
import S6 from './06-SeparatingEventsFromEffects.jsx'
import S7 from './07-RemovingEffectDependencies.jsx'
import S8 from './08-ReusingLogicWithCustomHooks.jsx'

const sections = [
  [1, '使用 ref 引用值', S1],
  [2, '使用 ref 操作 DOM', S2],
  [3, '使用 Effect 进行同步', S3],
  [4, '你可能不需要 Effect', S4],
  [5, '响应式 Effect 的生命周期', S5],
  [6, '将事件从 Effect 中分开', S6],
  [7, '移除 Effect 依赖', S7],
  [8, '使用自定义 Hook 复用逻辑', S8],
]

export default function App() {
  return (
    <div style={{ fontFamily: 'system-ui', maxWidth: 640, margin: '0 auto', padding: 16 }}>
      <h1>第四章 · 脱围机制</h1>
      {sections.map(([n, title, Comp]) => (
        <section key={n} style={{ borderTop: '1px solid #eee', padding: '12px 0' }}>
          <h2>{n}. {title}</h2>
          <Comp />
        </section>
      ))}
    </div>
  )
}
