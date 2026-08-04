# 单元 08 · Select 选择器

> 主题：用 Radix Select 原语做一个「可完全自定义、键盘可操作、自带定位」的下拉选择器，并理解受控 / 非受控两种集成方式。

## 1. 现象

原生 `<select>` 有两大痛点：

- **样式难改**：下拉列表（option 弹出层）是浏览器/系统渲染的，CSS 几乎改不了，每套设计稿都要妥协。
- **移动端会唤起系统选择器**：在手机上点开就是一个原生大轮子，和你的 App 风格完全割裂。

shadcn 的 `Select` 完全不用原生 `<select>`，它用 Radix 的 Select 原语重做了一个「假下拉」——**触发器是按钮，弹出层是任意 DOM**，因此你能用 Tailwind 把它做成任何样子，且移动端也是同一套 UI。

```tsx
<Select>
  <SelectTrigger className="w-full">
    <SelectValue placeholder="选择一项" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="apple">苹果</SelectItem>
    <SelectItem value="banana">香蕉</SelectItem>
  </SelectContent>
</Select>
```

三段式记忆：`Trigger`（按钮 + 当前值）→ `Content`（弹出层）→ `Item`（每个选项）。

## 2. 原理：Radix Select 替我们做了什么

`Select` 组件（`src/components/ui/select.tsx`）本质只是把 `@radix-ui/react-select` 的各原语包一层 `data-slot` + Tailwind 皮肤。**真正的「行为」全部来自 Radix**，无需我们写一行逻辑：

| 能力 | 由谁提供 | 说明 |
|---|---|---|
| 键盘导航 | Radix | ↑↓ 移动、Enter 选择、Esc 关闭、Space 打开 |
| 首字母快速定位（typeahead） | Radix | 输入「p」直接跳到「苹果」之类 |
| 自动定位 + 碰撞翻转 | Radix | 用 `--radix-select-content-available-height` / `-transform-origin` 等 CSS 变量，靠近视口边缘时自动翻转到另一侧 |
| 滚动按钮 | Radix | 选项多时上下出现 `SelectScrollUpButton` / `SelectScrollDownButton` |
| 屏幕阅读器 | Radix | 自动加 `role`、`aria-*`、隐藏的标签，读出「已选：苹果」 |
| Portal 脱离布局 | `SelectPrimitive.Portal` | 弹出层挂到 `body`，不被父级 `overflow:hidden` 裁切 |

源码里这几行就是 Portal 与 CSS 变量的体现：

```tsx
<SelectPrimitive.Portal>
  <SelectPrimitive.Content
    data-slot="select-content"
    className={cn(
      "... max-h-(--radix-select-content-available-height) ... origin-(--radix-select-content-transform-origin) ...",
      ...
    )}
  >
```

注意 `SelectItem` 右侧那个对勾：它不是每个 item 都显示，而是由 `SelectPrimitive.ItemIndicator` 包裹，Radix **只在「当前选中项」上才渲染它**。这就是为什么勾选标记能自动跟着值走：

```tsx
<SelectPrimitive.Item data-slot="select-item" {...props}>
  <span className="absolute right-2 ...">
    <SelectPrimitive.ItemIndicator>
      <CheckIcon className="size-4" />
    </SelectPrimitive.ItemIndicator>
  </span>
  <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
</SelectPrimitive.Item>
```

## 3. 代码：受控 vs 非受控

这是本单元的核心知识点——**Select 的值怎么交给 React 管**。

### ① 受控（controlled）：自己掌握 value

```tsx
const [theme, setTheme] = useState("system")

<Select value={theme} onValueChange={setTheme}>
  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
  <SelectContent>
    <SelectItem value="light">浅色</SelectItem>
    <SelectItem value="dark">深色</SelectItem>
    <SelectItem value="system">跟随系统</SelectItem>
  </SelectContent>
</Select>
```

- `value` 是当前选中的 **value 字符串**（如 `"dark"`），`onValueChange` 在切换时回调新值。
- 因为值在你的 `state` 里，可以立刻显示、提交、或驱动别的 UI（示例里实时回显 `theme`）。

### ② 非受控（uncontrolled）：交给组件自己管

```tsx
<Select defaultValue="beijing">
  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
  <SelectContent>
    <SelectItem value="beijing">北京</SelectItem>
    <SelectItem value="shanghai">上海</SelectItem>
  </SelectContent>
</Select>
```

只给 `defaultValue`，后续选了什么由 Radix 内部记录；适合「不需要实时读值、只在提交表单时取值」的场景。

> **为什么需要受控/非受控这个概念？** 因为 Select 本质是个「有内部状态的小机器」。把 value 抽出来（受控）能让你把下拉和表单、URL、全局状态连起来；让它自己管（非受控）则最省事。这和原生 `<input value>` / `<input defaultValue>` 是同一套心智模型——**React 里所有「输入类」组件都如此**。

### ③ 禁用单个选项

```tsx
<SelectItem value="xizang" disabled>西藏（暂不可选）</SelectItem>
```

给 `SelectItem` 加 `disabled`，该项变灰、不可点、键盘也跳不过去。整个 `Select` 也能 `disabled`（禁用触发器）。

### ④ 分组

用 `SelectGroup` + `SelectLabel` + `SelectSeparator` 把长列表分组，结构清晰（见 `App.tsx` 第 ② 段）。

## 4. 为什么：Select 的两个「坑」与对比

1. **value 必须是字符串，且不能为空串**

   Radix Select 的 `value` / `SelectItem value` 只接受 `string`，**不允许空字符串 `""`**（空串会被当成「未选」）。如果你要从后端拿到数字 id，记得转成字符串：

   ```tsx
   <SelectItem value={String(user.id)}>{user.name}</SelectItem>
   ```

2. **`Select` ≠ `DropdownMenu`**

   二者长得很像（都是触发器 + 弹出层），但定位不同：

   | | Select | DropdownMenu（单元 07） |
   |---|---|---|
   | 用途 | 选一个「值」用于提交 | 触发「动作」（跳转、编辑、删除） |
   | 是否有选中态 | 有（ItemIndicator 对勾） | 无 |
   | 是否适合放表单 | ✅ 是 | ❌ 否 |
   | 键盘语义 | 表单控件 `role=combobox` | 菜单 `role=menu` |

   一句话：**要「选值」用 Select，要「做动作」用 DropdownMenu**。

---

回到 [根 README](../../README.md) · 下一单元：[单元 09 · 表单校验（react-hook-form + zod）](../../unit-09-form-validation)
