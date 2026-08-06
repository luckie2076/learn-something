// persist 中间件：将 store 状态持久化到 localStorage（或 sessionStorage / AsyncStorage）
// 刷新页面后状态依然保留——适合用户偏好设置、未提交的表单数据等
import { create } from "zustand"
import { persist } from "zustand/middleware"

interface SettingsStore {
  theme: "light" | "dark" | "system"
  fontSize: number
  sidebarOpen: boolean
  setTheme: (theme: "light" | "dark" | "system") => void
  setFontSize: (fontSize: number) => void
  toggleSidebar: () => void
  resetAll: () => void
}

const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      theme: "system" as const,
      fontSize: 16,
      sidebarOpen: true,
      setTheme: (theme) => set({ theme }),
      setFontSize: (fontSize) => set({ fontSize }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      resetAll: () =>
        set({ theme: "system", fontSize: 16, sidebarOpen: true }),
    }),
    {
      name: "app-settings", // localStorage 中的 key 名称
      // 可选：指定哪些字段要持久化（不指定则全部持久化）
      // partialize: (state) => ({ theme: state.theme }),
    },
  ),
)

export default function Persist() {
  const theme = useSettingsStore((s) => s.theme)
  const fontSize = useSettingsStore((s) => s.fontSize)
  const sidebarOpen = useSettingsStore((s) => s.sidebarOpen)
  const setTheme = useSettingsStore((s) => s.setTheme)
  const setFontSize = useSettingsStore((s) => s.setFontSize)
  const toggleSidebar = useSettingsStore((s) => s.toggleSidebar)
  const resetAll = useSettingsStore((s) => s.resetAll)

  return (
    <div className="space-y-3">
      <p className="text-xs text-zinc-400">
        修改设置后刷新页面，状态会从 <strong>localStorage</strong> 中恢复。打开 DevTools &gt; Application &gt; Local Storage 可看到 &quot;app-settings&quot;
      </p>

      {/* 主题 */}
      <div className="flex items-center gap-2">
        <span className="w-20 text-sm text-zinc-600">主题：</span>
        <div className="flex gap-1 rounded border border-zinc-300 p-0.5">
          {(["light", "dark", "system"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`rounded px-2 py-0.5 text-xs transition-colors ${
                theme === t
                  ? "bg-blue-500 text-white"
                  : "text-zinc-500 hover:bg-zinc-100"
              }`}
            >
              {t === "light" ? "浅色" : t === "dark" ? "深色" : "跟随系统"}
            </button>
          ))}
        </div>
      </div>

      {/* 字号 */}
      <div className="flex items-center gap-2">
        <span className="w-20 text-sm text-zinc-600">字号：</span>
        <input
          type="range"
          min={12}
          max={24}
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          className="flex-1"
        />
        <span className="w-8 text-sm font-mono text-right">{fontSize}px</span>
      </div>
      <p
        style={{ fontSize: `${fontSize}px` }}
        className="text-zinc-700"
      >
        这是当前字号的预览效果
      </p>

      {/* 侧边栏 */}
      <div className="flex items-center gap-2">
        <span className="w-20 text-sm text-zinc-600">侧边栏：</span>
        <button
          onClick={toggleSidebar}
          className={`rounded px-3 py-1 text-xs transition-colors ${
            sidebarOpen
              ? "bg-green-500 text-white"
              : "bg-zinc-300 text-zinc-600"
          }`}
        >
          {sidebarOpen ? "已展开" : "已收起"}
        </button>
      </div>

      {/* 重置 */}
      <button
        onClick={resetAll}
        className="rounded bg-orange-100 px-3 py-1 text-xs text-orange-600 hover:bg-orange-200"
      >
        重置全部设置
      </button>
    </div>
  )
}
