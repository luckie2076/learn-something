# Unit 06 · Accordion 组件

## 核心 CSS 知识点

### 1. max-height trick（折叠动画的核心）

CSS transition 只能对**数值属性**做动画。`height: auto` 不是数值，所以无法做 `height: 0 → height: auto` 的过渡。

解决方案——用 `max-height` 代替：

```css
/* 折叠时 */
max-height: 0;
overflow: hidden;

/* 展开时 */
max-height: 200px;  /* 或 scrollHeight */
transition: max-height 0.3s ease;
```

关键点：
- `max-height` 始终是数值，transition 可以正常工作
- `overflow: hidden` 把超出部分裁剪掉
- `scrollHeight` 是 DOM 元素的真实内容高度，通过 useRef 获取

### 2. overflow: hidden

折叠动画的核心搭档。没有它，即使 `max-height: 0`，内容仍然可见。

### 3. transition 配置

```css
transition: max-height 0.3s ease-in-out
```

- 只对 `max-height` 做过渡（不用 `all`，避免影响其他属性）
- `ease-in-out`：开始和结束都慢，中间快，视觉效果最自然

### 4. useRef + scrollHeight

```js
const ref = useRef(null)

// 展开时
ref.current.scrollHeight  // 获取内容的真实像素高度
```

---

## 运行

```bash
pnpm install && pnpm dev
```
