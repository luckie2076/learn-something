# 单元 10 · 反馈组件：Toast（Sonner）与 Alert

本单元讲两类「给用户反馈」的组件：**Toast**（一闪而过的轻提示）与 **Alert**（常驻在页面里的状态条）。
两者都「非阻塞」——不打断用户当前操作，这是它们和 Dialog 类模态框最大的区别。

---

## 一、现象：什么时候用哪一个？

- **Toast**：动作已经发出、结果需要「通知一下」，比如「保存成功」「已复制到剪贴板」。用户不需要回应，几秒后自动消失。
- **Alert**：需要**持续可见**的状态说明，比如「当前处于只读模式」「表单有 3 处错误」。它一直留在页面上，直到状态变化。

> 一句话记忆：**Toast 是动词的回执，Alert 是名词的状态。**

---

## 二、原理：shadcn 在这里做了什么？

### 1. Toast —— 几乎没做，只是「换皮」

Toast 功能完全由 [`sonner`](https://sonner.emilkowal.ski/) 这个库提供：它在 `document.body` 上挂了一个全局容器，用 `toast()` 命令式地往里塞消息。

shadcn 的 `sonner.tsx` 只做一件事：把 Toast 的外观接到**我们自己的设计令牌**上。

```tsx
const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      style={{
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border)",
      } as React.CSSProperties}
      {...props}
    />
  )
}
```

> 为什么这样设计？因为 Sonner 默认长得很「独立」，颜色不随主题走。通过覆盖它内部的 `--normal-*` 变量，Toast 就能自动跟着 `popover` / `border` 令牌变色，明暗主题切换时也不会脱节。
>
> 官方版还会用 `next-themes` 的 `useTheme()` 把 `theme` 设成自动跟随暗色——本单元先固定 `light`，暗色主题接入见单元 14，避免引入跨单元依赖。

### 2. Alert —— 用 cva 管理变体 + `has-[]` 容器查询布局

`alert.tsx` 用 `class-variance-authority`（cva）声明两种视觉：`default` 与 `destructive`。真正巧妙的是它的布局：

```tsx
"relative w-full ... has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] ..."
```

- 默认是 `grid-cols-[0_1fr]`（第一列宽度为 0，即没有图标时文字独占整行）。
- 当 Alert **内部放了 svg 图标**时，`has-[>svg]:` 命中，自动切成两列：图标占窄列、文字占宽列。

也就是说：**要不要图标、图标在哪，完全由「你有没有塞一个 svg 进去」决定**，组件本身不写任何分支逻辑。这正是 Tailwind v4「容器查询 + `has-` 选择器」的威力。

同时 `role="alert"` 会被自动带上，配合 `AlertTitle` / `AlertDescription` 的 `data-slot`，屏幕阅读器能正确朗读。

---

## 三、代码：怎么用

### Toast（命令式，需先挂载 `<Toaster />`）

```tsx
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"

// 任意位置调用，不需要写在组件 JSX 里
toast("已保存草稿", {
  description: "30 天后自动清理。",
  action: { label: "撤销", onClick: () => toast("已撤销") },
})

// 带语义色彩（底层是不同样式的同一套容器）
toast.success("发布成功")
toast.error("发布失败")

// 用同一个 id 把「加载中」升级成「完成」
const id = toast.loading("上传中…")
toast.success("上传完成", { id })

// 别忘了在应用根部渲染一次容器
function App() {
  return (<><Toaster /></>)
}
```

### Alert（声明式，放在组件里）

```tsx
import { AlertCircleIcon } from "lucide-react"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

<Alert>
  <TerminalIcon />
  <AlertTitle>提示</AlertTitle>
  <AlertDescription>这是一段说明文字。</AlertDescription>
</Alert>

<Alert variant="destructive">
  <AlertCircleIcon />
  <AlertTitle>无法连接服务器</AlertTitle>
  <AlertDescription>请检查网络设置。</AlertDescription>
</Alert>
```

> 注意：Alert 的「图标」不是 prop，而是**直接把孩子里的 svg 放进去**。`has-[>svg]` 会自动识别它并调整布局——这也是为什么 `AlertTitle` / `AlertDescription` 要用 `col-start-2` 明确占据第二列。

---

## 四、为什么：两个容易踩的坑

1. **`<Toaster />` 只渲染一次**：它其实是全局容器。在多个页面/组件里重复渲染会导致 toast 重复出现。习惯做法是在应用根组件挂一次。
2. **Toast 适合「已发生」的事，Alert 适合「当前状态」**：别用 Toast 去展示「必填项不能为空」这种需要用户对着改的错误（那该用表单内联错误，见单元 09）；也别用 Alert 去播「保存成功」这种一次性通知（它会一直赖在页面上）。

---

## 运行方式

```bash
cd unit-10-toast-alert
pnpm install
pnpm dev      # 打开提示的本地地址，点击按钮 / 查看提示条
# 或 pnpm build 做生产构建校验
```

> 本单元依赖 `sonner@2.0.7`，其余与单元 03/09 一致（cva、clsx、tailwind-merge、lucide-react）。
