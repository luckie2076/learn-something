import S1 from './01-JSXIsJSX.jsx'
import S2 from './02-TagRules.jsx'
import S3 from './03-Fragment.jsx'

const sections = [
  [1, 'JSX 是什么？', S1],
  [2, '标签规则', S2],
  [3, 'Fragment 片段', S3],
]

export default function App() {
  return (
    <div style={{ fontFamily: 'system-ui', maxWidth: 640, margin: '0 auto', padding: 16 }}>
      <h1>第一章 · JSX 基本语法</h1>
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
