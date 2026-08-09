# Unit 02 · Input 输入框

## 核心 CSS 知识点

### 1. 受控组件 — React 中管理表单值

```jsx
const [value, setValue] = useState("")
<input value={value} onChange={e => setValue(e.target.value)} />
```

React 的单向数据流中，表单元素的值由 state 控制，`onChange` 更新 state 完成闭环。非受控可以用 `defaultValue`。

### 2. forwardRef — 暴露内部 DOM 给父组件

```jsx
const Input = forwardRef((props, ref) => {
  return <input ref={ref} {...props} />
})
// 父组件可以用 ref.focus()、ref.select() 等
```

`ref` 是 React 不通过 props 传递的特殊属性，必须用 `forwardRef` 包装才能透传。

### 3. Flex 插槽布局 — icon + input + icon

```
┌─────┬──────────────────┬─────┐
│  🔍  │   <input />      │  ✕  │
│ icon │   核心输入区       │ icon │
└─────┴──────────────────┴─────┘
  pointer-events-none              pointer-events-none
```

```jsx
<div className="flex items-center border rounded-lg">
  <span className="pl-3 pointer-events-none">🔍</span>
  <input className="flex-1 px-3 py-2 outline-none" />
  <span className="pr-3 pointer-events-none">✕</span>
</div>
```

- `flex items-center`：标签和 input 垂直居中
- `flex-1`：input 填满剩余空间
- `pointer-events-none`：图标不拦截点击（点图标等价于点 input）
- 动态类名 `prefix ? "pl-9" : "px-3"`：有图标时加大左侧 padding

### 4. `:focus` vs `:focus-visible` — 聚焦样式选择

| 伪类 | 触发方式 | 适用场景 |
|------|---------|---------|
| `:focus` | 所有聚焦方式（鼠标、键盘、JS） | 确保聚焦状态始终可见 |
| `:focus-visible` | 仅键盘聚焦（Tab 键） | 不想让鼠标点击出现聚焦环 |

```css
/* 键盘聚焦时出现蓝色环，鼠标点击不出现 */
input:focus-visible { outline: 2px solid #3b82f6; outline-offset: 2px; }
```

**推荐用法**：Input 用 `:focus-visible` 配合 `ring`，既保持可访问性又不影响美观。

### 5. `:disabled` — 禁用态处理

```css
input:disabled {
  opacity: 0.5;           /* 视觉变灰 */
  cursor: not-allowed;    /* 光标变禁止符 */
}
<input disabled className="opacity-50 cursor-not-allowed" />
```

### 6. appearance: none — 重置原生样式

```css
/* 消除浏览器默认的表单样式，为自定义样式铺路 */
input {
  appearance: none;
  -webkit-appearance: none;
}
```

浏览器会给 `<input>` 添加默认样式（边框、背景、聚焦环），`appearance: none` 全部清除，方便完全自定义。

---

## 运行

```bash
pnpm install && pnpm dev
```
