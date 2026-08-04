# 单元 04 · 表单基础（Input / Label / Textarea）

> 前置：单元 02 讲了 shadcn「复制代码」机制，单元 03 讲了 cva。本单元看一组最常见的表单控件。
> 重点：同样是「复制进项目」的源码，但它们的复杂程度不同——有的只是样式封装，有的背后有 Radix 原语。

## 现象：三个组件，三种「厚度」

`npx shadcn@latest add input label textarea` 后，项目里多出三个文件。它们看起来类似，但本质不同：

| 组件 | 底层 | 是否依赖 Radix | 说明 |
| --- | --- | --- | --- |
| **Input** | 原生 `<input>` | 否 | 纯样式封装 |
| **Textarea** | 原生 `<textarea>` | 否 | 纯样式封装 |
| **Label** | `@radix-ui/react-label` | 是 | 基于可访问性原语 |

## 原理：为什么还要包一层？

原生 `<input>` 能用，但「好看且状态齐全」要写一大堆类：聚焦环、禁用态、校验错误红边……
shadcn 把这些**统一收敛**到组件里，你只需写 `className` 做微调。

### 1. Input / Textarea：纯样式封装

源码里它们只是在原生元素上套一组 Tailwind 类（见本单元 `src/components/ui/input.tsx`、`textarea.tsx`）。
关键点在于**状态样式的统一管理**：

```ts
"focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]", // 聚焦时的环
"disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50", // 禁用
"aria-invalid:ring-destructive/20 ... aria-invalid:border-destructive",           // 校验出错
```

含义：
- `focus-visible`：键盘聚焦时才显示环（鼠标点不闪），更友好。
- `aria-invalid`：当输入框被标记为 `aria-invalid="true"`（通常由校验逻辑设置），自动显示红色边框与红环——**样式跟随语义**，你不必手写条件类。
- `data-slot="input"`：给组件一个稳定锚点，父级可用 `data-[slot=input]:` 精准定位（同单元 03 讲的机制）。

### 2. Label：为什么用 Radix，而不是原生 `<label>`？

原生 `<label htmlFor="x">` 需要你手动保证 `id` 一致，且「点击文字聚焦控件」「控件禁用时文字变灰」都得自己处理。
shadcn 的 Label 建立在 `@radix-ui/react-label` 上：

```tsx
<LabelPrimitive.Root
  data-slot="label"
  className={cn(
    "... peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
    className
  )}
  {...props}
/>
```

- **点击聚焦**：Radix Label 内部已处理与控件的关联，点击文字即聚焦。
- **联动禁用**：`peer-disabled:opacity-50` 表示「当同级的输入框被禁用时，Label 自动变灰」——这正是演示页里「禁用态」那一组的效果。
- 你仍要写 `htmlFor` / `id` 配对（见 App.tsx），这是 HTML 可访问性的基本要求，Radix 不会替你省掉。

### 3. 受控 vs 非受控（表单的基石概念）

本单元演示用的是 `defaultValue`（**非受控**：DOM 自己记住值，提交时读取）。
与之相对的是**受控**：`value={state}` + `onChange={setState}`，值由 React state 持有。

| | 非受控 | 受控 |
| --- | --- | --- |
| 值存哪 | DOM | React state |
| 读取时机 | 提交时（`ref` 或 FormData） | 实时（`state`） |
| 适用 | 简单表单、一次性提交 | 需要实时校验/联动 |

> 单元 09 会用 `react-hook-form` + `zod` 给出受控表单的完整校验方案；这里先建立「两者区别」的认知。

## 代码：本单元新增了什么

- `src/components/ui/input.tsx`、`textarea.tsx` —— 纯样式封装。
- `src/components/ui/label.tsx` —— 基于 Radix Label 原语。
- `src/App.tsx` —— 演示：Label↔Input 关联、带前置图标的搜索框（`lucide-react`）、Textarea、禁用态联动。
- `package.json` 新增依赖：`@radix-ui/react-label`（Label 用）、`lucide-react`（图标）。

## 为什么这样设计（回到 shadcn 哲学）

- **统一的状态样式**：聚焦/禁用/出错三态在所有表单组件里表现一致，UI 不会「这里会红、那里不红」。
- **可访问性默认开启**：Label 的点击聚焦、disabled 联动由 Radix 兜底，你不用记这些细节。
- **仍是你的代码**：想改输入框圆角、想换聚焦环颜色，直接改 `input.tsx` 即可。

## 下一步

单元 05 讲 **Card**：这是一个典型的「复合组件（Compound Components）」——Card 自身不含布局，而是由 `CardHeader` / `CardTitle` / `CardContent` 等多个子组件拼装而成。
