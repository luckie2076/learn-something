# 单元 14 · 暗色模式（next-themes）

[上一单元：设计令牌原理](../unit-13-design-tokens/README.md) | [下一单元：品牌主题定制](../unit-15-brand-theme/README.md)

> 本单元在单元 13「设计令牌」的基础上，解决**如何切换并持久化明暗主题**。
> 核心结论：明暗视觉由令牌决定，next-themes 只负责「何时给 `<html>` 加 `.dark` 类」。

## 现象

单元 13 我们已经有了 `:root` 与 `.dark` 两套令牌。只要 `<html class="dark">`，整页就变暗。
但手动管理「用户选了什么、刷新后记住、跟随系统」很繁琐。next-themes 把这套逻辑封装好了。

## 原理：next-themes 做了什么

1. **切换 class**：配置 `attribute="class"` 后，next-themes 在 `<html>` 上增删 `dark` 类
   （也可设为 `data-theme` 等其它属性）。这正是 `@custom-variant dark (&:is(.dark *))`
   所监听的信号。
2. **持久化**：把用户选择写入 `localStorage`（key 默认 `theme`），刷新后自动恢复。
3. **跟随系统**：`enableSystem` 时支持 `system` 选项，用 `matchMedia` 监听系统配色变化。
4. **避免闪烁（FOUC）**：在 `<head>` 注入一段同步脚本，在 React 挂载前就根据存储值
   给 `<html>` 加好 class，避免「先亮后暗」的闪一下。

### 关键细节：客户端挂载前 theme 是 undefined

next-themes 的主题判定发生在浏览器端。首帧（含 SSR）时 `useTheme()` 的 `theme` 为
`undefined`。如果直接在首屏读取 `theme` 决定 UI，可能出现：服务端/首帧渲染与客户端不一致
（水合不匹配），或拿到错误的当前值。标准做法是用一个 `mounted` 状态，挂载后再展示主题相关 UI。

```tsx
const [mounted, setMounted] = useState(false)
useEffect(() => setMounted(true), [])
// mounted 为 false 时不依赖 theme 渲染
```

## 代码：本单元演示

- `src/components/theme-provider.tsx`：对 `next-themes` 的 `ThemeProvider` 做薄封装，
  统一 `attribute="class"` / `defaultTheme="system"` / `enableSystem` 配置。
- `src/main.tsx`：用 `<ThemeProvider>` 包裹整个应用。
- `src/App.tsx`：用 `useTheme()` 的 `theme` / `setTheme` 做 light/dark/system 三态切换，
  并用 `mounted` 规避首帧 undefined。
- `src/index.css`：与单元 13 相同的 `:root` + `.dark` 令牌（明暗切换的「弹药」）。

## 为什么用 next-themes 而不是直接 toggle class

- **持久化**：用户选择跨刷新保留，自己写要管 localStorage。
- **system 支持**：跟随系统并实时响应系统变化，自己写要管 `matchMedia`。
- **防闪烁**：内置脚本避免 FOUC，自己写容易踩坑。
- **生态标准**：shadcn/ui 官方暗色方案就是 next-themes，教学对齐官方实践。

## 运行

```bash
cd unit-14-dark-mode
pnpm install
pnpm dev
```
