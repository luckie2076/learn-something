import S1 from './01-ParentChild.jsx'
import S2 from './02-ChildrenConcept.jsx'
import S3 from './03-MultiReturn.jsx'

const sections = [
  [1, '父子元素嵌套', S1],
  [2, 'children 概念', S2],
  [3, '多元素返回与 Fragment', S3],
]

export default function App() {
  return (
    <div style={{ fontFamily: 'system-ui', maxWidth: 640, margin: '0 auto', padding: 16 }}>
      <h1>第三章 · 元素与子元素</h1>
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
