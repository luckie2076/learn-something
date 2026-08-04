import S1 from './01-BraceExpressions.jsx'
import S2 from './02-DynamicAttrs.jsx'
import S3 from './03-StyleObject.jsx'
import S4 from './04-ClassName.jsx'

const sections = [
  [1, '大括号 {} 嵌入表达式', S1],
  [2, '属性动态绑定', S2],
  [3, 'style 对象语法', S3],
  [4, 'className 与特殊属性', S4],
]

export default function App() {
  return (
    <div style={{ fontFamily: 'system-ui', maxWidth: 640, margin: '0 auto', padding: 16 }}>
      <h1>第二章 · 表达式与属性</h1>
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
