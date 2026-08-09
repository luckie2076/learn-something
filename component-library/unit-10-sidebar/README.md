# Unit 10 · Sidebar 侧边栏

## 核心 CSS 知识点

### 1. CSS Grid — 主布局双栏结构

页面整体使用 CSS Grid 将侧边栏和主内容区分为两栏：

```css
.layout {
  display: grid;
  grid-template-columns: auto 1fr;
  height: 100vh;
}
```

| 轨道 | 值 | 含义 |
|------|-----|------|
| 侧边栏 | `auto` | 宽度由内容决定（展开 224px / 折叠 64px） |
| 主内容 | `1fr` | 占据全部剩余空间 |

```jsx
<div className="h-screen grid grid-cols-[auto_1fr]">
  <Sidebar />
  <main>...</main>
</div>
```

### 2. CSS Flexbox — 侧边栏内部三段式布局

侧边栏内部是纵向三段结构，使用 Flexbox：

```
┌──────────────┐
│  Logo 区域    │  ← shrink-0（固定高度）
├──────────────┤
│              │
│  导航菜单     │  ← flex-1（填充剩余空间）
│              │
├──────────────┤
│  用户信息     │  ← shrink-0（固定高度）
└──────────────┘
```

```css
.sidebar {
  display: flex;
  flex-direction: column;
}
.logo      { flex-shrink: 0; }     /* shrink-0 — 不被压缩 */
.nav       { flex: 1; }            /* flex-1  — 占据所有剩余空间 */
.user-info { flex-shrink: 0; }     /* shrink-0 — 不被压缩 */
```

### 3. CSS Transition — 折叠动画

```css
.sidebar {
  transition: all 300ms ease-in-out;
  overflow: hidden;  /* 折叠时隐藏超出部分 */
}
.sidebar.collapsed {
  width: 64px;  /* 从 224px 变为 64px */
}
.sidebar.collapsed .label {
  opacity: 0;   /* 文字淡出 */
}
```

**折叠时的文字隐藏技巧** ── 不依赖 `display: none`：

```jsx
<span className={collapsed
  ? "opacity-0 w-0 overflow-hidden"
  : "opacity-100"
}>
  文字
</span>
```

- `opacity-0`：文字透明（参与 transition 动画）
- `w-0 overflow-hidden`：宽度收为 0 并裁切溢出
- `whitespace-nowrap`：防止文字在宽度缩小时换行

### 4. React Context — 共享折叠状态

```jsx
// 1. 创建 Context
const SidebarContext = createContext(null)

// 2. Provider 包裹整个布局
<SidebarProvider>
  <Sidebar />
  <main>
    <SidebarToggle />  {/* 导航栏中的折叠按钮 */}
  </main>
</SidebarProvider>

// 3. 自定义 hook 便于消费
function useSidebar() {
  const ctx = useContext(SidebarContext)
  if (!ctx) throw new Error("useSidebar must be used within <SidebarProvider>")
  return ctx
}
```

`SidebarToggle` 和 `Sidebar` 在 DOM 的不同分支中，通过 Context 共享同一个 `collapsed` 状态，无需手动传递 props。

### 5. position: sticky — 固定顶栏

```css
.topbar {
  position: sticky;
  top: 0;
  background: rgba(255,255,255,0.8);
  backdrop-filter: blur(8px);  /* 毛玻璃效果 */
}
```

| 定位方式 | 行为 |
|----------|------|
| `fixed` | 始终固定在视口某个位置，脱离正常流 |
| `sticky` ✅ | 正常流布局，滚动到阈值后"粘"在指定位置 |

`sticky` 的优势：不影响周围元素的布局流，只有滚动时才固定。

### 6. backdrop-blur — 毛玻璃效果

```css
backdrop-filter: blur(8px);
```

CSS `backdrop-filter` 对元素**背后**的区域应用滤镜（模糊、灰度等）。配合半透明背景（`bg-white/80`），实现 macOS/iOS 风格的毛玻璃效果。

---

## 运行

```bash
pnpm install && pnpm dev
```
