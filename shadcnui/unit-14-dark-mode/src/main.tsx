import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App.tsx"
import { ThemeProvider } from "@/components/theme-provider"
import "./index.css"

// 关键点 1：把整个应用包进 ThemeProvider。
// attribute="class" 表示 next-themes 通过切换 <html> 上的 class 来切换明暗。
// defaultTheme="system" 跟随系统；enableSystem 允许「跟随系统」这一选项。
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
