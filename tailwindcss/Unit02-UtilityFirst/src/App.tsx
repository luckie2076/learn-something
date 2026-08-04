// 单元 2 演示：同一按钮，① 用原子类拼出，② 用 styles.css 里的手写类 .btn 实现，外观一致。
export default function App() {
  return (
    <div className="flex min-h-screen items-center justify-center gap-8 bg-slate-50 p-8">
      <button className="rounded bg-blue-600 px-4 py-2 text-white">原子类按钮</button>
      <button className="btn">手写类按钮</button>
    </div>
  )
}
