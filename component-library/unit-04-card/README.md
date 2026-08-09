# Unit 04 · Card 卡片

## 核心 CSS 知识点

### 1. 复合组件模式 — Card / CardHeader / CardContent / CardFooter

将一个复杂的组件拆分为多个语义化子组件，组合使用：

```jsx
<Card>
  <CardHeader>
    <CardTitle>标题</CardTitle>
    <CardDescription>描述文字</CardDescription>
  </CardHeader>
  <CardContent>主要内容</CardContent>
  <CardFooter>底部操作</CardFooter>
</Card>
```

**为什么不用 props 传所有内容？**
- 子组件的排列顺序完全由使用者控制
- 每个子组件可以有自己的样式和语义
- 不需要定义几十个 props（title、description、footerContent...）

**命名导出的优势**：所有子组件使用 `export function Card()` 而非 `export default`，强制使用者通过解构导入 `{ Card, CardHeader }`，避免命名混乱。

### 2. 子区域间距设计

```jsx
<CardHeader className="flex flex-col space-y-1.5">
  <CardTitle>标题</CardTitle>
  <CardDescription>描述</CardDescription>
</CardHeader>
```

- `flex flex-col`：标题和描述纵向排列
- `space-y-1.5`：子元素之间 6px 间距（比 gap 更兼容旧浏览器）

### 3. border-radius + shadow — 卡片的"立体感"

Card 的视觉特征就是圆角 + 阴影，让卡片"浮"在背景之上：

```css
.card {
  border-radius: 0.5rem;    /* rounded-lg — 柔和圆角 */
  border: 1px solid #e5e7eb; /* border-zinc-200 — 微弱边界 */
  box-shadow: 0 1px 3px rgba(0,0,0,0.1); /* shadow-sm — 轻微投影 */
  background: white;
}
```

### 4. 覆盖父级样式 — pt-0 技巧

```jsx
<CardContent className="p-6 pt-0">
```

`p-6` 设置 24px 四周 padding，`pt-0` 覆盖上方的 padding。因为 Tailwind 按 CSS 声明顺序应用，后写的类名优先级更高。

### 5. 语义化 HTML 标签

子组件使用了原生 HTML 语义标签而非 `<div>`：

| 子组件 | 标签 | 语义 |
|--------|------|------|
| `CardTitle` | `<h3>` | 三级标题 |
| `CardDescription` | `<p>` | 段落文本 |

虽然 CSS 可以将 `<div>` 渲染成任何样式，但语义化标签对屏幕阅读器和 SEO 更友好。

---

## 运行

```bash
pnpm install && pnpm dev
```
