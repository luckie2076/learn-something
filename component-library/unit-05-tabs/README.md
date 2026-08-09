# Unit 05 · Tabs 组件

## 核心 CSS 知识点

### 1. Flex 水平布局

TabsList 使用 `inline-flex` 让 tab 按钮水平排列：

```css
inline-flex h-10 items-center justify-center gap-1
```

- `inline-flex` — 宽度由内容撑开（不会像 `flex` 占满整行）
- `items-center` — 垂直居中
- `justify-center` — 水平居中

### 2. 状态驱动样式

TabsTrigger 根据 `activeTab === value` 切换两套样式：

```jsx
className={
  isActive
    ? "bg-white text-zinc-900 shadow-sm"   // 激活：白底深字+阴影
    : "text-zinc-500 hover:text-zinc-700"   // 未激活：灰字
}
```

这就是「状态驱动 UI」——React state 变化 → 类名变化 → 视觉变化。

### 3. CSS transition 动画

`transition-all` 让背景色、文字色、阴影的切换有平滑过渡：

```css
transition-all  /* 等价于 transition: all 150ms ease */
```

- 从灰色背景切换到白色背景不是瞬间跳变，而是 150ms 的渐变
- 配合 `hover:text-zinc-700` 也有过渡效果

### 4. React Context 数据共享

```
Tabs (提供 activeTab + setActiveTab)
├── TabsList
│   ├── TabsTrigger (消费 Context，切换 tab)
│   └── TabsTrigger
└── TabsContent (消费 Context，条件渲染)
```

Context 让深层嵌套的子组件无需通过 props 层层传递就能访问状态。

### 5. 条件渲染

```jsx
if (activeTab !== value) return null  // 非激活的面板不渲染
```

只渲染当前激活的 Tab 内容，未激活的不会被插入 DOM。

---

## 运行

```bash
pnpm install && pnpm dev
```
