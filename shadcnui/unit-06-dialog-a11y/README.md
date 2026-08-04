# 单元 06 · Dialog 对话框与可访问性（a11y）

> 单元 05 讲了「复合组件」的结构之美；本单元在它之上叠加一层更硬核的东西——
> **可访问性（Accessibility, a11y）**。你会看到 shadcn 如何用 Radix 原语，
> 几乎「零成本」地获得一套符合 WAI-ARIA 规范的模态框行为。

## 一、现象：一个对话框，自动拥有了「正确」的行为

打开演示页点开对话框，你会发现它**不用写任何 JS** 就具备：

- 按 `Tab`：焦点被锁在对话框内，不会跑回背景；
- 按 `Esc`：自动关闭；
- 点击半透明遮罩：关闭；
- 打开时：背景页面不可滚动；
- 关闭后：焦点自动回到触发按钮。

这些不是 shadcn 写的，而是 **`@radix-ui/react-dialog`** 这个「原语」提供的。
shadcn 的 `dialog.tsx` 只是把它**包了一层样式**。

## 二、原理：shadcn Dialog = Radix 原语 + 一层皮

看 `src/components/ui/dialog.tsx`，每个导出几乎都是「直接转发 Radix 原语」：

```tsx
import * as DialogPrimitive from "@radix-ui/react-dialog"

function Dialog({ ...props }: ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}
function DialogTrigger({ ...props }) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}
```

Radix Dialog 暴露的原语与职责：

| Radix 原语 | shadcn 包装 | 干什么 |
|---|---|---|
| `Root` | `Dialog` | 状态机：open/close、context 下发 |
| `Trigger` | `DialogTrigger` | 点击打开；**支持 `asChild`** |
| `Portal` | `DialogPortal` | 把浮层渲染到 `<body>` 末尾（见下） |
| `Overlay` | `DialogOverlay` | 半透明遮罩，点它关闭 |
| `Content` | `DialogContent` | 对话框本体；内置焦点陷阱、Esc、滚动锁 |
| `Title` | `DialogTitle` | 给对话框一个可访问的名称（**必填**） |
| `Description` | `DialogDescription` | 描述 |
| `Close` | `DialogClose` | 关闭触发器；**支持 `asChild`** |

**关键点**：`DialogContent` 把 `Portal` + `Overlay` + 关闭按钮「打包」了，
所以你只需写 `<DialogContent>…</DialogContent>` 就拿到完整浮层。

### 1) 为什么需要 Portal（传送门）

没有 Portal，对话框是按钮的**后代 DOM 节点**。一旦祖先有 `overflow: hidden`、
`transform`、`z-index` 限制，对话框就会被裁剪或压在底下。

`DialogPortal` 用 `ReactDOM.createPortal` 把浮层挂到 **`<body>` 直接子节点**，
彻底跳出任何祖先的布局/层叠上下文——这是模态框「永远置顶、不被裁剪」的根本原因。

### 2) 焦点陷阱（Focus Trap）与 Esc

`DialogContent`（Radix `Content`）在打开时：
- 把焦点移入对话框；
- 拦截 `Tab`/`Shift+Tab`，让焦点在对话框内循环（困住）；
- 监听 `Esc` 关闭；
- 给 `<body>` 加滚动锁；
- 关闭后把焦点还给你传进 `Trigger` 的元素。

这些全部是 **Radix 内部用原生 DOM API 实现的**，你一行都不用写。

### 3) 为什么必须有 `DialogTitle`

Radix 要求每个 `Content` 内有且仅有 `DialogPrimitive.Title`，否则会在控制台抛出
可访问性警告——因为屏幕阅读器靠它把对话框念成「某某对话框，开始」。
所以 shadcn 的 `DialogHeader` + `DialogTitle` 不是装饰，而是**合规要求**。

> 这就是为什么 `DialogContent` 的关闭按钮里有个 `<span className="sr-only">关闭</span>`：
> 图标按钮对屏幕阅读器无名，用视觉隐藏文字补上可读标签（`sr-only` = 仅读屏可见）。

## 三、代码：asChild 在这里再次出现

本单元的演示同时复用了单元 03 的 `asChild`：

```tsx
<DialogTrigger asChild>
  <Button variant="outline">打开对话框</Button>
</DialogTrigger>

<DialogFooter>
  <DialogClose asChild>
    <Button variant="outline">取消</Button>
  </DialogClose>
  <Button variant="destructive">确认删除</Button>
</DialogFooter>
```

`Trigger` 和 `Close` 都是 Radix 原语，都支持 `asChild`：
- 默认 `<DialogTrigger>` 渲染成 `<button>`；用 `asChild` 把它「套」到你的 `<Button>` 上，
  得到一个带按钮样式、但语义/行为仍由 Radix 负责的触发器；
- 同理 `<DialogClose asChild>` 让「取消」按钮真正执行关闭。

这正是单元 03 讲的「多态渲染」在真实组件里的落地。

## 四、为什么 shadcn 选择「包 Radix」而非自己造

| 自己手写模态框 | 包 Radix（shadcn 选择） |
|---|---|
| 焦点陷阱要手写、易错 | Radix 已实现且经过大量测试 |
| Esc / 遮罩点击 / 滚动锁要逐个处理 | 开箱即用 |
| 屏幕阅读器支持常被遗漏 | 强制 Title、正确 role/aria |
| 样式与行为耦合 | 样式（shadcn）与行为（Radix）解耦，可各自改 |

本质：**shadcn 负责「长什么样」，Radix 负责「怎么正确地工作」**。两者通过
「把原语转发 + 加 `data-slot` + 加默认 Tailwind 类」这一固定套路结合——这就是单元 02
说的「复制而非安装」在工程上的最大收益：行为来自依赖，外观与结构在你手里，随时可改。

## 五、本单元小结

- shadcn `Dialog` ≈ 给 `@radix-ui/react-dialog` 原语包一层 Tailwind 样式；
- **Portal** 让浮层脱离祖先布局、永远置顶；
- **焦点陷阱 / Esc / 点击遮罩 / 滚动锁** 全部由 Radix 提供，零 JS；
- **`DialogTitle` 是合规必填**，关系屏幕阅读器能否正确念出对话框；
- `asChild` 让 `Trigger`/`Close` 套上任意组件（如 `Button`），呼应单元 03；
- 设计哲学：**shadcn 管外观，Radix 管行为**。

> 下一步（单元 07）：`Dropdown Menu` 会复用「Radix 原语 + asChild + Portal」同一套路，
> 但场景变成「菜单」——你会看到 `Trigger` 如何和命令式菜单列表配合。
