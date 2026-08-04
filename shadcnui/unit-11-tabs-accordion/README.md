# 单元 11 · 布局型组件：Tabs 与 Accordion

本单元讲两种「在一块区域里切换内容」的组件：**Tabs**（标签横向切换）和 **Accordion**（手风琴纵向展开）。
它们都基于 Radix 原语，shadcn 只负责把样式套上去——所以你几乎不用写任何交互逻辑。

---

## 一、现象：都是「切换」，有何不同？

- **Tabs**：一组横向标签，点哪个看哪块；标签始终可见，适合「并列对照」（如 概览/分析/设置）。
- **Accordion**：一条条可折叠的项，点开看详情；其余收起，适合「清单式 FAQ / 配置分组」。

> 选择标准：**内容少、需并列** → Tabs；**内容多、一次只聚焦一条** → Accordion。

---

## 二、原理：Radix 替我们做了什么？

### 1. Tabs —— 核心是「value 配对」

底层是 `@radix-ui/react-tabs`，它维护一个「当前激活 value」的状态：

- `<Tabs.Root>` 上的 `value` / `defaultValue` / `onValueChange` 控制当前显示哪块。
- 每个 `<Tabs.Trigger value="x">` 和 `<Tabs.Content value="x">` 通过 **相同的 value 配对**。点 Trigger，Radix 自动把对应 Content 显示出来，并给激活的 Trigger 打上 `data-state="active"`。

shadcn 的 `tabs.tsx` 基本是「转发 + 加样式」，逻辑全在 Radix 里：

```tsx
function TabsTrigger({ className, ...props }: ...) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "data-[state=active]:bg-background ... data-[state=active]:shadow-sm ...",
        className,
      )}
      {...props}
    />
  )
}
```

> 注意那些 `data-[state=active]:` 前缀：`data-state` 是 Radix 根据当前是否激活自动写上的属性，Tailwind 据此切换高亮样式。这是 shadcn 组件「用 Radix 的状态属性驱动样式」的统一套路。

### 2. Accordion —— 核心是「受控的展开状态」

底层是 `@radix-ui/react-accordion`：

- `type="single"` 表示一次只能展开一项；`type="multiple"` 可多项同开。
- `collapsible` 允许把已展开的项再点回去收起（否则 single 模式下点已展开项不会收起）。
- `AccordionTrigger` 里那个箭头图标用 `[&[data-state=open]>svg]:rotate-180`：**当父级 `data-state=open` 时，让里面的 svg 旋转 180°**——展开/收起的动画完全由 Radix 暴露的状态属性驱动，无需手写 JS。

### 3. 折叠动画从哪来？

`AccordionContent` 用了 `data-[state=open]:animate-accordion-down` 这类关键帧动画。它们不是 Tailwind 内置的，而是来自 `tw-animate-css`（我们在 `index.css` 里 `@import "tw-animate-css"`）。Radix 在打开/关闭时切换 `data-state`，动画随之触发。

---

## 三、代码：怎么用

```tsx
// Tabs：Trigger 与 Content 靠 value 一一配对
<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">概览</TabsTrigger>
    <TabsTrigger value="analytics">分析</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">…概览内容…</TabsContent>
  <TabsContent value="analytics">…分析内容…</TabsContent>
</Tabs>

// Accordion：item 的 value 是项的唯一标识
<Accordion type="single" collapsible defaultValue="item-1">
  <AccordionItem value="item-1">
    <AccordionTrigger>标题</AccordionTrigger>
    <AccordionContent>展开后的内容</AccordionContent>
  </AccordionItem>
</Accordion>
```

> 受控写法：把 `defaultValue` 换成 `value` + `onValueChange` 即可把状态接到你自己的 state（和单元 08 的 Select 同理）。

---

## 四、为什么：两个容易踩的坑

1. **value 必须唯一且配对**：Tabs/Accordion 的 Trigger 与 Content/Item 靠 `value` 关联。value 拼错或重复，就会出现「点了没反应 / 显示错面板」。
2. **single 模式默认不能全部收起**：如果你希望初始就全收，记得加 `collapsible`；否则第一项一旦展开就关不掉。

---

## 运行方式

```bash
cd unit-11-tabs-accordion
pnpm install
pnpm dev      # 点击标签 / 展开手风琴查看切换效果
# 或 pnpm build 做生产构建校验
```

> 本单元依赖 `@radix-ui/react-tabs@1.1.21` 与 `@radix-ui/react-accordion@1.2.20`；Tabs 演示复用单元 05 的 Card 复合组件。
