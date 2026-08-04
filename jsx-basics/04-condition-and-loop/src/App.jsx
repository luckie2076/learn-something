import S1 from './01-Ternary.jsx'
import S2 from './02-ShortCircuit.jsx'
import S3 from './03-MapAndKey.jsx'

const sections = [
  [1, '三元表达式 ? :', S1],
  [2, '&& 短路渲染', S2],
  [3, 'map 列表与 key', S3],
]

export default function App() {
  return (
    <div style={{ fontFamily: 'system-ui', maxWidth: 640, margin: '0 auto', padding: 16 }}>
      <h1>第四章 · 条件与循环渲染</h1>
      {sections.map(([n, title, Comp]) => (
        <section key={n}>
          <h2>{n}. {title}</h2>
          <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8 }}>
            <Comp />
          </div>
        </section>
      ))}
    </div>
  )
}
