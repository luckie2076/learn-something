// 单元 8 演示：@custom-variant 把 dark: 绑定到 .dark 类，点击切换整页明暗
export default function App() {
  const toggleDark = () => document.documentElement.classList.toggle('dark')

  return (
    <div className="min-h-screen bg-white p-8 text-black dark:bg-slate-900 dark:text-white">
      <button
        onClick={toggleDark}
        className="rounded-lg bg-slate-200 px-4 py-2 text-black dark:bg-slate-700 dark:text-white"
      >
        切换深色模式
      </button>
      <p className="mt-4">页面在明暗两套配色间切换。</p>
    </div>
  )
}
