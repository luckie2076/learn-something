# Unit 05 · Tabs 标签页

## 核心 CSS 知识点

### 1. CSS Flex 水平布局

Tabs 的核心布局是一排水平排列的按钮，使用 Flexbox：

```html
<div role="tablist" className="flex gap-1 bg-zinc-100 rounded-md p-1">
  <button role="tab">标签页 1</button>
  <button role="tab">标签页 2</button>
  <button role="tab">标签页 3</button>
</div>
```

- `flex`：所有按钮水平排列
- `gap-1`：按钮之间 4px 间距
- 外层 `bg-zinc-100` + 内层选中态 `bg-white` 形成"胶囊切换"效果

### 2. 状态驱动样式 — useState + 条件类名

```jsx
const [active, setActive] = useState("tab1")

<button
  className={active === "tab1" ? "bg-white shadow-sm" : "text-zinc-500 hover:text-zinc-800"}
  onClick={() => setActive("tab1")}
>
  标签页 1
</button>
```

CSS 类名由 JS 状态决定，点击时更新状态，React 自动重渲染并应用新样式。

### 3. CSS Transition — 背景切换动画

```css
transition-all duration-200
```

让选中态的白色背景平滑过渡，而不是瞬间切换。`duration-200` ≈ 200ms，适合微交互。

### 4. React Context — 跨组件共享选中状态

```
<TabsProvider>          ← 提供 activeTab + setActiveTab
  <TabsList>            ← 从 Context 读取 activeTab
    <TabsTrigger />     ← 从 Context 读取 + 写入
  </TabsList>
  <TabsContent />       ← 从 Context 读取，显示对应内容
</TabsProvider>
```

```jsx
const TabsContext = createContext(null)
// Provider 在 Tabs 组件中包裹 value={activeTab, setActiveTab}
// 子组件用 useContext(TabsContext) 读取
```

使用 Context 的好处：`TabsTrigger` 和 `TabsContent` 不需要通过 props 传递 `activeTab`，各自从 Context 直接获取。

**安全注意**：`createContext(null)` 的默认值为 `null`，如果子组件被放在 Provider 外部使用会报错。生产代码中通常用自定义 hook 加检查：

```jsx
function useTabs() {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error("TabsContent must be used within <Tabs>")
  return ctx
}
```

### 5. WAI-ARIA 无障碍属性

```html
<div role="tablist" aria-label="标签页列表">
  <button role="tab" aria-selected={active === "tab1"}>标签页 1</button>
</div>
<div role="tabpanel">内容 1</div>
```

- `role="tablist" / "tab" / "tabpanel"`：告知屏幕阅读器这是标签页结构
- `aria-selected="true/false"`：告知当前哪个标签被选中

### 6. 条件渲染 vs CSS 隐藏

```jsx
{active === "tab1" && <TabsContent>内容</TabsContent>}
```

用条件渲染（`&&`）而非 `display: none`，未激活的 tab 内容完全不渲染到 DOM，减少 DOM 节点数。

---

## 运行

```bash
pnpm install && pnpm dev
```
