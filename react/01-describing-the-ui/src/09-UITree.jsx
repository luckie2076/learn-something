// React 把整个界面看成一棵树：App 是根，子组件往下嵌套。
// 理解这棵树的好处：
//  - props 只能从父节点流向子节点（单向）；
//  - React 的“渲染树”决定了 UI 如何被构建，“模块依赖树”决定了代码如何被打包。
function Header() {
  return <header>🌐 网站头部</header>
}
function Sidebar() {
  return <nav>📚 侧边栏</nav>
}
function Content() {
  return <main>📄 正文</main>
}

export default function Demo() {
  return (
    <div>
      <Header />
      <div style={{ display: 'flex', gap: 12 }}>
        <Sidebar />
        <Content />
      </div>
    </div>
  )
}
