// 渲染次数可视化对比：使用 selector 精确订阅 vs 直接取整个 store
// 通过计数器直观看到两种方式的渲染次数差异
import React from "react"
import { create } from "zustand"

interface PerfStore {
  count: number
  text: string
  increment: () => void
  setText: (text: string) => void
}

const usePerfStore = create<PerfStore>()((set) => ({
  count: 0,
  text: "hello",
  increment: () => set((s) => ({ count: s.count + 1 })),
  setText: (text) => set({ text }),
}))

// ❌ 坏习惯：直接返回整个 store 对象
// 每次任何字段变化，这个组件都会重渲染
function SubscriberAll() {
  const store = usePerfStore() // 无 selector → 订阅整个 store
  const renderCount = React.useRef(0)
  renderCount.current++

  return (
    <div className="rounded bg-red-50 p-3">
      <p className="text-sm font-medium text-red-600">❌ 订阅整个 store</p>
      <p className="text-sm">
        count={store.count} text=&quot;{store.text}&quot;
      </p>
      <p className="mt-1 text-xs text-red-400">
        渲染次数：{renderCount.current}
        <span className="ml-2">（任何字段变化都重渲染）</span>
      </p>
    </div>
  )
}

// ✅ 好习惯：用 selector 精确订阅
function SubscriberCount() {
  const count = usePerfStore((s) => s.count) // 只订阅 count
  const renderCount = React.useRef(0)
  renderCount.current++

  return (
    <div className="rounded bg-green-50 p-3">
      <p className="text-sm font-medium text-green-600">✅ 只订阅 count</p>
      <p className="text-sm">count={count}</p>
      <p className="mt-1 text-xs text-green-500">
        渲染次数：{renderCount.current}
        <span className="ml-2">（只有 count 变化才渲染）</span>
      </p>
    </div>
  )
}

function SubscriberText() {
  const text = usePerfStore((s) => s.text) // 只订阅 text
  const renderCount = React.useRef(0)
  renderCount.current++

  return (
    <div className="rounded bg-blue-50 p-3">
      <p className="text-sm font-medium text-blue-600">✅ 只订阅 text</p>
      <p className="text-sm">text=&quot;{text}&quot;</p>
      <p className="mt-1 text-xs text-blue-500">
        渲染次数：{renderCount.current}
        <span className="ml-2">（只有 text 变化才渲染）</span>
      </p>
    </div>
  )
}

export default function PerfDemo() {
  const increment = usePerfStore((s) => s.increment)
  const setText = usePerfStore((s) => s.setText)

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button
          onClick={increment}
          className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
        >
          count++
        </button>
        <button
          onClick={() => setText("world")}
          className="rounded bg-purple-500 px-3 py-1 text-sm text-white hover:bg-purple-600"
        >
          text → &quot;world&quot;
        </button>
      </div>
      <p className="text-xs text-zinc-400">
        打开控制台或观察渲染次数，对比三种订阅方式的差异
      </p>
      <SubscriberAll />
      <SubscriberCount />
      <SubscriberText />
    </div>
  )
}
