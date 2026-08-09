import { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/Tabs.jsx"

function Section({ title, children }) {
  return (
    <section className="mb-10">
      <h2 className="mb-4 text-lg font-semibold text-zinc-700">{title}</h2>
      {children}
    </section>
  )
}

export default function App() {
  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">
        Unit 05 · Tabs 组件
      </h1>
      <p className="mb-8 text-zinc-500">
        学习 React state 驱动 UI、Flex 水平布局、CSS transition 动画
      </p>

      {/* ---- 基础 tabs ---- */}
      <Section title="基础用法">
        <Tabs defaultValue="account">
          <TabsList>
            <TabsTrigger value="account">账号</TabsTrigger>
            <TabsTrigger value="password">密码</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <p className="rounded-lg border border-zinc-200 bg-white p-4 text-sm text-zinc-600">
              这里是账号设置的详细内容。你可以在这里修改邮箱、用户名等信息。
            </p>
          </TabsContent>
          <TabsContent value="password">
            <p className="rounded-lg border border-zinc-200 bg-white p-4 text-sm text-zinc-600">
              这里是密码修改页面。请输入旧密码和新密码。
            </p>
          </TabsContent>
        </Tabs>
      </Section>

      {/* ---- 多 tab ---- */}
      <Section title="多个选项卡">
        <Tabs defaultValue="music">
          <TabsList>
            <TabsTrigger value="music">音乐</TabsTrigger>
            <TabsTrigger value="podcast">播客</TabsTrigger>
            <TabsTrigger value="live">直播</TabsTrigger>
            <TabsTrigger value="radio">电台</TabsTrigger>
          </TabsList>
          <TabsContent value="music">
            <div className="rounded-lg border border-zinc-200 bg-white p-6">
              <h3 className="font-semibold">推荐音乐</h3>
              <p className="mt-1 text-sm text-zinc-500">为你精选的最新歌曲。</p>
            </div>
          </TabsContent>
          <TabsContent value="podcast">
            <div className="rounded-lg border border-zinc-200 bg-white p-6">
              <h3 className="font-semibold">热门播客</h3>
              <p className="mt-1 text-sm text-zinc-500">科技、财经、生活类播客推荐。</p>
            </div>
          </TabsContent>
          <TabsContent value="live">
            <div className="rounded-lg border border-zinc-200 bg-white p-6">
              <h3 className="font-semibold">正在直播</h3>
              <p className="mt-1 text-sm text-zinc-500">当前热门直播间。</p>
            </div>
          </TabsContent>
          <TabsContent value="radio">
            <div className="rounded-lg border border-zinc-200 bg-white p-6">
              <h3 className="font-semibold">电台 FM</h3>
              <p className="mt-1 text-sm text-zinc-500">全国各地的电台频道。</p>
            </div>
          </TabsContent>
        </Tabs>
      </Section>

      {/* ---- 原理拆解 ---- */}
      <Section title="原理拆解">
        <div className="space-y-2 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600">
          <p><strong>1. React Context</strong> — 在 Tabs 树中共享 activeTab 状态和 setActiveTab</p>
          <p><strong>2. Flex 水平布局</strong> — TabsList 内部用 <code className="rounded bg-zinc-200 px-1">inline-flex</code> 让 tab 水平排列</p>
          <p><strong>3. 状态驱动样式</strong> — TabsTrigger 根据 <code className="rounded bg-zinc-200 px-1">isActive</code> 切换 bg-white/bg-transparent</p>
          <p><strong>4. transition-all</strong> — 背景色、文字色切换有 150ms 过渡动画</p>
          <p><strong>5. 条件渲染</strong> — TabsContent 在非 active 时 return null，只渲染当前面板</p>
        </div>
      </Section>
    </main>
  )
}
