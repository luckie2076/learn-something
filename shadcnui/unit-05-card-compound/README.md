# 单元 05 · Card 与复合组件（Compound Components）模式

> 本单元看点的不是「卡片长什么样」，而是 **一个 UI 组件该如何被拆分成多个可自由拼装的零件**。
> `Card` 是 shadcn 里「复合组件模式」最典型、最易读的范例。

## 一、现象：一个卡片由很多零件拼成

```tsx
<Card>
  <CardHeader>
    <CardTitle>项目已保存</CardTitle>
    <CardDescription>你的更改已经成功写入数据库。</CardDescription>
  </CardHeader>
  <CardContent>……正文……</CardContent>
  <CardFooter>……底部动作……</CardFooter>
</Card>
```

注意：这里**没有一个「大组件」**把所有布局塞进一个 `props`。而是 `Card` 像容器，里面放了一堆叫 `CardHeader` / `CardTitle` / `CardContent` / `CardFooter` 的小组件，由你决定放哪些、怎么放。

这些子组件从哪里来？它们都定义在 `src/components/ui/card.tsx` 这一个文件里，一起被 `export`：

```tsx
export {
  Card, CardHeader, CardFooter, CardTitle,
  CardAction, CardDescription, CardContent,
}
```

## 二、原理：什么是「复合组件模式」

**复合组件（Compound Components）** 是一种 React 组件设计模式：
用一个「父组件」作为命名空间/容器，下面挂多个「子组件」，父子之间通过**约定好的结构**协作，而不是通过一大堆 `props` 配置。

为什么 `Card` 要用这种模式，而不是写成这样？

```tsx
// ❌ 反例：用一个巨型 props 对象描述所有部位
<Card
  title="项目已保存"
  description="..."
  content="..."
  footer="..."
  action={<Badge>已生成</Badge>}
/>
```

问题：
1. **内容自由度低**：`content` 只能传字符串，没法放列表、表单、按钮。
2. **组合僵化**：想「只要头部不要底部」做不到，结构被组件作者定死。
3. **类型复杂**：每个部位都要在 `CardProps` 里单独声明类型。

而复合组件把**每个部位拆成独立组件**，于是：
- `CardContent` 里可以放**任意 JSX**（文本、表单、表格都行）；
- 想用哪些部位就写哪些，不写就不渲染（见演示页「极简用法」）；
- 每个子组件只是普通的 `<div>`，类型天然简单。

> 一句话：**复合组件把「结构的选择权」从组件作者手里，还给了使用者。**

## 三、代码：每个子组件其实都很「轻」

看 `card.tsx` 的实现——**没有一个子组件用了 `forwardRef`、`useState` 或复杂逻辑**。它们几乎都是「带固定类名的一个 `<div>`」：

```tsx
function CardContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div data-slot="card-content" className={cn("px-6", className)} {...props} />
  )
}
```

关键观察：
- **每个子组件只负责自己那一小块的最小样式**（`CardContent` 只管 `px-6` 水平内边距）；
- 整体外观由「父容器 + 各部位拼起来」自然形成，而非某处集中计算；
- `cn(...)` 把你的 `className` 合并进来，依然能自由覆盖（复习单元 03）。

### `data-slot` 又出现了

每个子组件都打了 `data-slot="card-xxx"`。它的作用（回顾单元 02/03）：
1. **可被外层 CSS 精准选中**：比如 `CardHeader` 里有
   `has-data-[slot=card-action]:grid-cols-[1fr_auto]`——
   意思是「当我的子孙里出现 `data-slot="card-action"` 时，我就自动切成两列」。
   这就是 `CardAction` 能「贴」到标题右上角的秘密（演示页第 2 个例子）。
2. **调试锚点**：浏览器 DevTools 里一眼能看出哪块是哪个子组件。

### 容器查询小彩蛋：`@container/card-header`

`CardHeader` 上有 `@container/card-header`，给头部区域建了一个**容器查询上下文**。
这意味着头部的布局可以「根据自己宽度」而非视口宽度来响应——当卡片被放进很窄的栏目时，
头部内部能自动重排。这是 Tailwind v4 容器查询能力的落地，也是 shadcn 新模板的写法。

## 四、为什么 shadcn 大量采用复合组件

不止 `Card`，`Dialog`（Trigger/Content/Header/Footer）、`Tabs`（List/Trigger/Content）、
`Table`（Table/Header/Row/Cell）、`Accordion` 等都是同一套路。原因归纳：

| 维度 | 单一巨型组件 | 复合组件（shadcn 选择） |
|---|---|---|
| 内容灵活度 | 受限（多为字符串） | 任意 JSX |
| 组合方式 | 被作者定死 | 使用者自由拼装 |
| 样式覆盖 | 靠复杂 props | 每个零件都能单独加 `className` |
| 可访问性 | 容易写错 | 结构语义清晰，便于接 Radix 原语 |
| 类型 | props 爆炸 | 每个零件类型极小 |

**代价**：使用者要记住零件的名字和嵌套关系。shadcn 用 `components.json` 的 `ui` 别名 +
一份 `card.tsx` 源码落进项目，让你既能「开箱即用」，又能「随时改源码」——
这正呼应单元 02 讲的「复制而非安装」机制。

## 五、本单元小结

- `Card` 不是组件，是**一组组件**（Compound Components）；
- 每个子组件 = 一个带最小样式的 `<div>` + `data-slot` 锚点；
- 灵活来自「使用者决定组合」，而非「作者配置 props」；
- `CardAction` + `has-data-[slot=...]` 展示了「子组件存在即影响父布局」的精巧联动；
- 这套模式是 shadcn 组件库的通用语法，后续 Dialog / Tabs / Table 都会再见。

> 下一步（单元 06）：`Dialog` 会在这个模式基础上，进一步引入 **Radix 原语 + Portal + 焦点陷阱**，
> 你会看到「复合组件」如何与「可访问性」结合。
