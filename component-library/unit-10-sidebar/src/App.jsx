import { Sidebar, SidebarProvider, SidebarToggle } from "./components/Sidebar.jsx"

function Section({ title, children }) {
  return (
    <section className="rounded-xl border border-zinc-200 p-6 space-y-4">
      <h2 className="text-lg font-semibold text-zinc-800">{title}</h2>
      {children}
    </section>
  )
}

function ContentArea() {
  return (
    <div className="flex-1 overflow-auto overscroll-contain">
      {/* 顶栏 */}
      <header className="sticky top-0 z-10 flex items-center gap-4 px-6 h-14 bg-white/80 backdrop-blur-sm border-b border-zinc-200">
        <SidebarToggle />
        <h2 className="font-medium text-zinc-800">控制台</h2>
      </header>

      {/* 主内容区 */}
      <div className="max-w-4xl mx-auto p-8 space-y-8">
        <Section title="CSS Grid + Flexbox 构建布局">
          <p className="text-sm text-zinc-500">
            Sidebar 采用 <strong>CSS Grid</strong> 构建双栏布局（侧边栏 + 主内容），
            侧边栏内部使用 <strong>Flexbox</strong> 纵向排列 Logo、导航、用户信息三个区域。
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
              <p className="text-sm font-medium text-blue-800">Grid 容器</p>
              <code className="text-xs text-blue-600">grid-template-columns: auto 1fr</code>
              <p className="text-xs text-blue-500 mt-1">左侧自适应宽度，右侧填满剩余空间</p>
            </div>
            <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-100">
              <p className="text-sm font-medium text-emerald-800">Flexbox 内部</p>
              <code className="text-xs text-emerald-600">flex flex-col</code>
              <p className="text-xs text-emerald-500 mt-1">Logo / 导航 / 用户 三段式纵向排列</p>
            </div>
          </div>
        </Section>

        <Section title="Transition 折叠动画">
          <p className="text-sm text-zinc-500">
            侧边栏折叠时宽度从 <code className="bg-zinc-100 px-1 rounded">w-56</code> 变为
            <code className="bg-zinc-100 px-1 rounded">w-16</code>，文本通过
            <code className="bg-zinc-100 px-1 rounded">opacity-0</code> 隐藏，
            配合 <code className="bg-zinc-100 px-1 rounded">transition-all duration-300</code> 实现平滑过渡。
          </p>
          <div className="space-y-2 text-sm text-zinc-600">
            <p><strong className="text-zinc-800">关键 Tailwind 类：</strong></p>
            <ul className="list-disc list-inside space-y-1 text-zinc-500">
              <li><code className="bg-zinc-100 px-1 rounded">transition-all duration-300 ease-in-out</code> — 所有可过渡属性平滑变化</li>
              <li><code className="bg-zinc-100 px-1 rounded">overflow-hidden</code> — 防止折叠后内容溢出</li>
              <li><code className="bg-zinc-100 px-1 rounded">whitespace-nowrap</code> — 文本不换行，配合 overflow-hidden 隐藏</li>
            </ul>
          </div>
        </Section>

        <Section title="sticky 顶栏">
          <p className="text-sm text-zinc-500">
            使用 <code className="bg-zinc-100 px-1 rounded">position: sticky</code> +{' '}
            <code className="bg-zinc-100 px-1 rounded">top-0</code> 实现顶部固定导航栏，
            配合 <code className="bg-zinc-100 px-1 rounded">backdrop-blur-sm</code> 实现毛玻璃效果。
          </p>
          <p className="text-sm text-zinc-400">
            向下滚动本页面即可观察顶栏的 sticky 效果 ↑
          </p>
        </Section>

        {/* 填充滚动区域 */}
        <div className="space-y-4">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="h-24 rounded-lg bg-zinc-50 border border-zinc-100" />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <SidebarProvider>
      <div className="h-screen flex overflow-hidden">
        <Sidebar />
        <ContentArea />
      </div>
    </SidebarProvider>
  )
}
