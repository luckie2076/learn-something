import SplitPane from "./components/SplitPane.jsx"

function Section({ title, children }) {
  return (
    <section className="rounded-xl border border-zinc-200 p-6 space-y-4">
      <h2 className="text-lg font-semibold text-zinc-800">{title}</h2>
      {children}
    </section>
  )
}

function FileItem({ name, lines, active }) {
  return (
    <div
      className={[
        "px-3 py-1.5 text-xs rounded-md cursor-pointer transition-colors",
        active
          ? "bg-blue-50 text-blue-700 font-medium"
          : "text-zinc-600 hover:bg-zinc-50",
      ].join(" ")}
    >
      <span>{name}</span>
      <span className="ml-2 text-zinc-400">{lines} L</span>
    </div>
  )
}

function FileTree() {
  return (
    <div className="h-full p-3 bg-zinc-50 border-r border-zinc-200">
      <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
        文件浏览器
      </p>
      <div className="space-y-1">
        <FileItem name="App.jsx" lines={42} active />
        <FileItem name="Header.jsx" lines={18} />
        <FileItem name="Sidebar.jsx" lines={56} />
        <FileItem name="Button.jsx" lines={34} />
        <FileItem name="Input.jsx" lines={28} />
        <FileItem name="Card.jsx" lines={22} />
      </div>
    </div>
  )
}

function CodeViewer() {
  return (
    <div className="h-full p-4 overflow-auto">
      <p className="text-xs font-semibold text-zinc-400 mb-3">App.jsx</p>
      <pre className="text-xs text-zinc-700 font-mono leading-relaxed whitespace-pre">
{`import { useState } from "react"
import SplitPane from "./components/SplitPane"

export default function App() {
  return (
    <div className="h-screen">
      <SplitPane direction="horizontal">
        {/* 左侧面板 */}
        <FileTree />
        {/* 右侧面板 */}
        <SplitPane direction="vertical">
          <CodeViewer />
          <Terminal />
        </SplitPane>
      </SplitPane>
    </div>
  )
}`}
      </pre>
    </div>
  )
}

function Terminal() {
  return (
    <div className="h-full bg-zinc-900 text-zinc-300 p-3 font-mono text-xs overflow-auto">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-2 h-2 rounded-full bg-red-400" />
        <span className="w-2 h-2 rounded-full bg-yellow-400" />
        <span className="w-2 h-2 rounded-full bg-green-400" />
        <span className="text-zinc-500 ml-2">终端</span>
      </div>
      <p className="text-green-400">$ pnpm dev</p>
      <p className="text-zinc-400">VITE v8.1.5  ready in 320ms</p>
      <p className="text-zinc-400">{'>'} Local: http://localhost:5173/</p>
    </div>
  )
}

export default function App() {
  return (
    <div className="h-screen flex flex-col">
      {/* 标题区 */}
      <header className="flex items-center gap-4 px-6 h-12 bg-white border-b border-zinc-200 shrink-0">
        <h1 className="text-lg font-bold text-zinc-900">SplitPane · 可分割面板</h1>
        <span className="text-xs text-zinc-400">拖拽中间的分隔条来调整面板大小</span>
      </header>

      {/* SplitPane 演示 */}
      <div className="flex-1 overflow-hidden">
        <SplitPane direction="horizontal" initialRatio={30}>
          {/* 左侧：文件树 */}
          <FileTree />

          {/* 右侧：代码 + 终端（上下分栏） */}
          <SplitPane direction="vertical" initialRatio={60}>
            <CodeViewer />
            <Terminal />
          </SplitPane>
        </SplitPane>
      </div>
    </div>
  )
}
