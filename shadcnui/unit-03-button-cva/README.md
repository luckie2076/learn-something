# 单元 03 · Button 与 cva 变体系统

> 前置：单元 02 已接入 shadcn，并解释了「三个库如何协作（Radix + cva + cn）」。
> 本单元**逐行解剖** `src/components/ui/button.tsx`，把 cva 与 asChild 讲透。

先看一眼完整文件（已在本单元 `src/components/ui/button.tsx`），下面分段拆解。

## 一、cva：类型安全的「变体工厂」

`cva` 来自 `class-variance-authority`。它解决的问题是：一个组件有多种外观（颜色、尺寸），
若用 `if/else` 拼字符串既啰嗦又无类型提示。cva 把「变体 → 类名」结构化。

```ts
const buttonVariants = cva(
  // ① 基础类：所有按钮共有
  "inline-flex items-center justify-center ... rounded-md text-sm font-medium ...",
  {
    variants: {
      variant: { default: "...", destructive: "...", outline: "...", /* ... */ },
      size:    { default: "h-9 px-4 py-2", sm: "h-8 ...", lg: "...", icon: "h-9 w-9" },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
)
```

**为什么这样写更好？**
- 调用 `buttonVariants({ variant: "destructive", size: "lg" })` 返回拼好的类名字符串。
- `variant`/`size` 的取值被 `variants` 里的键**类型约束**：写 `variant: "abc"` 编译期就报错。
- `defaultVariants` 让你省略参数时也有合理默认值（等价于写 `default`/`default`）。

## 二、Button 组件如何把 cva 接上

```ts
function Button({
  className, variant, size, asChild = false, ...props
}: ComponentProps<"button">            // 原生 <button> 的所有属性（onClick 等）
  & VariantProps<typeof buttonVariants> // 注入 variant/size（类型来自上面的 cva）
  & { asChild?: boolean }               // 额外的组合开关
) {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}
```

要点：
1. **`VariantProps<typeof buttonVariants>`** —— 把 cva 定义的 `variant`/`size` 自动变成组件的 props，类型与 cva 定义保持单一来源。
2. **`cn(buttonVariants({ variant, size, className }))`** —— 先由 cva 生成默认类，再传入用户 `className`。`cn` 里的 `tailwind-merge` 会让**用户传入的类覆盖默认类**（如 `rounded-full` 覆盖 `rounded-md`）。这就是「既能统一、又能定制」的来源。
3. **`data-slot="button"`** —— shadcn 约定的标记位。Tailwind v4 下，父组件可用 `data-[slot=button]:` 之类的选择器对子组件做精准样式定位，而无需额外的类名约定。

## 三、asChild：样式与元素的「解耦」（Radix Slot）

`asChild` 是 shadcn 组件可组合性的核心。

```tsx
<Button asChild>
  <a href="https://ui.shadcn.com" target="_blank">访问官网</a>
</Button>
```

工作机制（来自 `@radix-ui/react-slot` 的 `Slot`）：
- `asChild=true` 时，`Comp = Slot` 而非 `"button"`。
- `Slot` 会**丢弃自己那层 DOM**，把自身的 `className` / 事件等 props **合并到唯一的子元素 `<a>` 上**。
- 结果：渲染出来的是 `<a class="...按钮样式...">`，既拥有按钮外观，又保留 `<a>` 的链接语义与可访问性。

**为什么这很重要？** 你不必为每个场景（按钮、链接、菜单项）重写样式；一套样式，任意元素复用。这也是为什么 shadcn 几乎所有交互组件都支持 `asChild`。

> 反例：若不用 Slot，而是 `<button onClick={...}><a>...</a></button>`，会出现「按钮里套链接」的非法/不语义结构。

## 四、为什么导出 `buttonVariants`

文件末尾 `export { Button, buttonVariants }`。导出 `buttonVariants` 让你在组件外用纯类名：

```tsx
import { buttonVariants } from "@/components/ui/button"
<a className={buttonVariants({ variant: "outline", size: "sm" })}>登录</a>
```

当你只想给一个现成元素「披上按钮皮肤」而不需要 Button 组件时，这很方便。

## 小结

| 机制 | 解决了什么 |
| --- | --- |
| **cva** | 把「多套外观」结构化为类型安全的变体，告别 if/else 拼类 |
| **VariantProps** | 让组件 props 与 cva 定义保持单一来源、自动同步 |
| **cn / tailwind-merge** | 用户 className 安全覆盖默认类，无冲突 |
| **asChild / Slot** | 样式与元素解耦，一套样式复用到任意标签 |
| **data-slot** | 给组件一个稳定的样式锚点，便于父级精准定位 |

## 下一步

单元 04 进入「表单基础」：Input / Label / Textarea——它们同样由 shadcn 复制进项目，但多为「纯样式封装」（Label 例外，建立在 Radix Label 原语上）。
