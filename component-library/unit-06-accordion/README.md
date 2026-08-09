# Unit 06 · Accordion 手风琴

## 核心 CSS 知识点

### 1. max-height 折叠动画 — 为什么不用 height？

CSS `transition` 可以直接对 `height` 做动画，但有两个问题：

| 方式 | 问题 |
|------|------|
| `transition: height` | 需要知道确切的目标高度值（`height: 200px`），内容动态变化时难以确定 |
| `transition: max-height` ✅ | 设一个足够大的上限值（如 `max-height: 1000px`），内容变化不会超出 |

```css
.accordion-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 300ms ease;
}
.accordion-content.open {
  max-height: var(--content-height); /* = scrollHeight（px） */
}
```

`scrollHeight` 是元素的完整内容高度（包括溢出部分），比 `clientHeight`（可见部分）更能反映真实高度。

### 2. useRef + scrollHeight — JS 获取真实高度

```jsx
const contentRef = useRef(null)

useEffect(() => {
  if (open && contentRef.current) {
    const height = contentRef.current.scrollHeight
    contentRef.current.style.maxHeight = `${height}px`
  } else {
    contentRef.current.style.maxHeight = "0px"
  }
}, [open])
```

为什么不用 Tailwind 类名切换来做动画？因为 `max-height` 的目标值是动态的（取决于内容），无法预先写成固定的 CSS 类名，只能用 JS 动态设置 inline style。

### 3. single vs multiple — 两种交互模式

```jsx
// single 模式：同一时间只展开一项
const [openItem, setOpenItem] = useState(null)

// multiple 模式：可同时展开多项
const [openItems, setOpenItems] = useState([])
```

`data-*` 属性传递 value 值：

```html
<div data-accordion-item="item-1" onClick={handleClick}>
```
```jsx
// 用 closest() 向上查找最近的 [data-accordion-item]
const value = e.target.closest("[data-accordion-item]").dataset.accordionItem
```

`closest()` 是原生 DOM API，从当前元素向上遍历找到最近的匹配祖先元素——适合事件委托场景。

### 4. transition-[max-height] — Tailwind 任意属性语法

```jsx
className="transition-[max-height] duration-300 ease-in-out"
```

Tailwind 的 `transition-*` 默认只包含常见属性，`max-height` 不在其中。`transition-[max-height]` 使用 JIT 任意值语法，显式指定要过渡的属性。

### 5. 内联 SVG 代替图标库

```jsx
function ChevronDown({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}
```

手写 SVG 路径比引入图标库更轻量，不需要额外依赖。配合 `transition-transform rotate-180` 可以在展开时箭头旋转。

---

## 运行

```bash
pnpm install && pnpm dev
```
