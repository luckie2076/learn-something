# 单元 07 · Dropdown Menu 下拉菜单

> 沿用单元 06 的同一套路：**shadcn 包一层样式，Radix 原语提供行为**。
> 本单元重点看「菜单」这类命令式 UI 是怎么被组织的：触发器、定位浮层、状态项（勾选/单选）。

## 一、现象：一个按钮，展开一个能键盘操作的菜单

演示页点开「打开菜单」：
- 上下方向键在条目间移动，`Enter` 选择，`Esc` 关闭；
- 条目可带快捷键提示（如 `⇧⌘P`）、分隔线、分组标题、禁用态；
- 第二个菜单里勾选项、单选对齐方式，左侧自动出现 ✓ / ● 标记。

这些键盘与定位行为**同样不是 shadcn 写的**，来自 `@radix-ui/react-dropdown-menu`。

## 二、原理：还是「Radix 原语 + 一层皮」

`src/components/ui/dropdown-menu.tsx` 把 Radix 各原语转发并加样式：

| Radix 原语 | shadcn 包装 | 干什么 |
|---|---|---|
| `Root` | `DropdownMenu` | 状态与上下文 |
| `Trigger` | `DropdownMenuTrigger` | 点开菜单；**支持 `asChild`** |
| `Portal` | （内联在 Content 里） | 把浮层挂到 `<body>`，避免被裁剪 |
| `Content` | `DropdownMenuContent` | 菜单本体；**定位 + 动画 + 键盘导航** |
| `Item` | `DropdownMenuItem` | 单个条目；focus/disabled 样式 |
| `Group` | `DropdownMenuGroup` | 逻辑分组（仅语义） |
| `Label` | `DropdownMenuLabel` | 分组标题（不可点） |
| `Separator` | `DropdownMenuSeparator` | 分隔线 |
| `CheckboxItem` / `RadioItem` / `RadioGroup` | 对应包装 | 带选中标记的状态项 |

### 1) 定位完全交给 Radix

`DropdownMenuContent` 不用你写 `position: absolute` 也算得准位置。Radix 在运行时
测量触发器与视口，把浮层定位到触发器的 `side`（上/下/左/右）并做「碰撞翻转」
（空间不够自动翻到另一侧）。它还会通过 CSS 变量把信息暴露给样式：

```tsx
"max-h-(--radix-dropdown-menu-content-available-height)
 origin-(--radix-dropdown-menu-content-transform-origin)
 data-[side=bottom]:slide-in-from-top-2 ..."
```

- `--radix-dropdown-menu-content-available-height`：根据视口剩余高度限制菜单最大高，避免溢出；
- `--radix-...-transform-origin`：让弹出动画从触发器那一侧「长」出来；
- `data-[side=*]`：不同方向用不同进场动画。

> 这正是 shadcn 代码「读 Radix 变量」的典型写法，也是为什么它的组件离不开对应 Radix 包。

### 2) `ItemIndicator`：状态项的选中标记

`CheckboxItem` / `RadioItem` 里都有一个关键结构：

```tsx
<span className="absolute left-2 ...">
  <DropdownMenuPrimitive.ItemIndicator>
    <CheckIcon className="size-4" />
  </DropdownMenuPrimitive.ItemIndicator>
</span>
```

`ItemIndicator` 是 Radix 提供的「槽」：**只有当该项处于选中状态时，里面的图标才渲染**。
所以你无需自己写 `checked ? <Check/> : null`——选中逻辑由 Radix 的 `checked` 状态驱动，
图标是否出现由 `ItemIndicator` 控制。左侧留 `pl-8` 的空位，正是给这个标记预留的。

### 3) `asChild` 再次出场

```tsx
<DropdownMenuTrigger asChild>
  <Button variant="outline">打开菜单</Button>
</DropdownMenuTrigger>
```

和单元 06 的 `DialogTrigger asChild` 完全一致：`Trigger` 是 Radix 原语、支持 `asChild`，
于是把按钮样式套到触发器上，而不破坏 Radix 的开关行为。

## 三、为什么是「复合组件 + 原语」而不是一个大 `<Menu items={...}>`

对比「传入 items 数组」的写法：

```tsx
// ❌ 数组式：每个条目能放的内容被 items 结构限制
<Menu items={[{ label: "个人资料", shortcut: "⇧⌘P" }, ...]} />
```

数组式的问题：条目里很难塞自定义的复杂 JSX（图标、嵌套、任意组件）。而 shadcn 的
复合写法每个 `DropdownMenuItem` 就是普通 React 节点，**里面想放什么放什么**——
快捷键提示、图标、整段表单都行。这延续了单元 05 讲的「结构选择权归使用者」原则。

## 四、本单元小结

- Dropdown Menu = `@radix-ui/react-dropdown-menu` 原语 + shadcn 的 Tailwind 皮肤；
- **定位/碰撞翻转/键盘导航**由 Radix 负责，靠 CSS 变量（`--radix-*`）把信息传给样式；
- **`ItemIndicator`** 自动在选中时显示 ✓/●，无需手写条件渲染；
- `Trigger`/`Content` 仍走 **`asChild` + Portal** 老套路（呼应单元 03、06）；
- 复合组件让每个菜单项是「自由 JSX 节点」，比「数组配置」更灵活；
- 设计哲学不变：**shadcn 管外观，Radix 管行为**。

> 下一步（单元 08）：`Select` 选择器与 Dropdown Menu 底层同源（都是 Radix 浮层原语），
> 但多了「选中值受控 / 非受控」与表单集成，正好接回单元 04 讲的受控概念。
