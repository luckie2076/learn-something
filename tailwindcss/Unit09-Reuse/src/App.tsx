function Button({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return (
    <button className={`rounded bg-blue-600 px-4 py-2 text-white ${className}`}>
      {children}
    </button>
  )
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-50 p-8">
      <button className="btn">@apply 复用的 .btn</button>
      <Button>组件化 Button（默认）</Button>
      <Button className="bg-rose-600">组件化 Button（覆盖为玫红）</Button>
    </div>
  )
}
