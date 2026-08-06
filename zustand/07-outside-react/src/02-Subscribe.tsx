// subscribe：监听 store 变化，支持带 selector 的精确订阅
// 与 useEffect 不同：subscribe 在组件外也能用，且支持 selector 过滤器
import { useState } from "react"
import { create } from "zustand"
import { subscribeWithSelector } from "zustand/middleware"

interface ChatStore {
  messages: Array<{ id: number; user: string; text: string }>
  onlineCount: number
  sendMessage: (user: string, text: string) => void
  userJoined: () => void
  userLeft: () => void
}

// subscribeWithSelector 中间件让 subscribe 支持 selector 参数
const useChatStore = create<ChatStore>()(
  subscribeWithSelector((set) => ({
    messages: [],
    onlineCount: 0,
    sendMessage: (user, text) =>
      set((s) => ({
        messages: [...s.messages, { id: Date.now(), user, text }],
      })),
    userJoined: () => set((s) => ({ onlineCount: s.onlineCount + 1 })),
    userLeft: () =>
      set((s) => ({ onlineCount: Math.max(0, s.onlineCount - 1) })),
  })),
)

// 组件外订阅：只要有新消息，就输出到 console
// 这在实际项目中的等价做法：有新消息时弹系统通知、更新未读角标等
useChatStore.subscribe(
  (s) => s.messages.length,
  (newLen) => {
    console.log(`【组件外订阅】消息数变为 ${newLen}`)
  },
)

export default function Subscribe() {
  const messages = useChatStore((s) => s.messages)
  const onlineCount = useChatStore((s) => s.onlineCount)
  const sendMessage = useChatStore((s) => s.sendMessage)
  const userJoined = useChatStore((s) => s.userJoined)
  const userLeft = useChatStore((s) => s.userLeft)

  const [input, setInput] = useState("")
  const [username] = useState(() => `用户${Math.floor(Math.random() * 1000)}`)

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(username, input.trim())
      setInput("")
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-zinc-400">
        <code className="rounded bg-zinc-100 px-1">subscribeWithSelector</code> 中间件让
        <code className="rounded bg-zinc-100 px-1">subscribe()</code> 支持 selector 过滤。打开控制台观察组件外的订阅日志。
      </p>

      {/* 在线人数 */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-zinc-600">
          在线人数：<span className="font-bold text-green-600">{onlineCount}</span>
        </span>
        <button
          onClick={userJoined}
          className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-600 hover:bg-green-200"
        >
          加入
        </button>
        <button
          onClick={userLeft}
          className="rounded bg-red-100 px-2 py-0.5 text-xs text-red-600 hover:bg-red-200"
        >
          离开
        </button>
      </div>

      {/* 聊天区域 */}
      <div className="rounded border border-zinc-200">
        <div className="max-h-48 overflow-y-auto p-3 space-y-2">
          {messages.length === 0 ? (
            <p className="text-xs text-zinc-400">暂无消息，发送第一条吧</p>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="text-sm">
                <span className="font-medium text-zinc-600">{msg.user}</span>
                <span className="mx-1 text-zinc-300">:</span>
                <span>{msg.text}</span>
              </div>
            ))
          )}
        </div>
        <div className="flex border-t border-zinc-200">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={`以 ${username} 的身份发言...`}
            className="flex-1 px-3 py-2 text-sm focus:outline-none"
          />
          <button
            onClick={handleSend}
            className="rounded-tr bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
          >
            发送
          </button>
        </div>
      </div>
    </div>
  )
}
