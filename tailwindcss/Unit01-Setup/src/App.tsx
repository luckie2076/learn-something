// 单元 1：验证 Tailwind 用起来很简单。
// 不需要任何配置或额外组件——给元素加上类名就有样式。
export default function App() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-800">Hello Tailwind</h1>
        <p className="mt-2 text-slate-500">几个类名就搞定样式，就这么简单。</p>
        <button className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white">
          点我
        </button>
      </div>
    </div>
  )
}
