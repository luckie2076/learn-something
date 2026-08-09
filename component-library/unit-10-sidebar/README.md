# Unit 10 · Sidebar 侧边栏

## 核心 CSS 知识点

### 1. CSS Grid — 双栏布局

使用 Grid 将页面分为侧边栏 + 主内容两个区域：

```css
.layout {
  display: grid;
  grid-template-columns: auto 1fr;
  height: 100vh;
}
```

- `auto`：侧边栏宽度由内容决定（展开 224px / 折叠 64px）
- `1fr`：主内容区占据剩余全部空间

```jsx
<div className="h-screen grid grid-cols-[auto_1fr]">
  <Sidebar />
  <Main />
</div>
```

### 2. CSS Flexbox — 侧边栏内部布局

侧边栏内部使用 Flexbox 纵向排列三段内容：

```css
.sidebar {
  display: flex;
  flex-direction: column;  /* 纵向排列 */
}
```

三段结构：
1. **Logo 区**（`shrink-0` 固定高度）
2. **导航区**（`flex-1` 填充中间空间）
3. **用户信息区**（`shrink-0` 固定高度）

### 3. CSS Transition — 折叠动画

```css
.sidebar {
  transition: all 300ms ease-in-out;
  overflow: hidden;          /* 防止折叠时内容溢出 */
}
.sidebar-collapsed .label {
  opacity: 0;                /* 文字淡出 */
}
```

### 4. position: sticky — 固定顶栏

```css
.topbar {
  position: sticky;
  top: 0;
  background: rgba(255,255,255,0.8);
  backdrop-filter: blur(8px);  /* 毛玻璃效果 */
}
```

`sticky` 和 `fixed` 的区别：
- `fixed`：始终固定在视口某个位置
- `sticky`：滚动到阈值后才固定，不滚动时正常流布局

## 运行

```bash
pnpm install && pnpm dev
```
