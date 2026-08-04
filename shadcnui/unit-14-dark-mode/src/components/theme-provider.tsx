import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ComponentProps } from "react"

/*
 * 对 next-themes 的 Provider 做一层薄封装，统一配置项，方便在 main.tsx 使用。
 * attribute="class"：明暗通过 <html> 的 class 切换（与 @custom-variant dark 配合）。
 * defaultTheme / enableSystem：支持 light / dark / system 三种取值。
 */
export function ThemeProvider({
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props} />
}
