# 单元 12 · 数据展示：Table / Avatar / Badge

本单元讲三个「展示型」原子组件：**Table**（结构化数据）、**Badge**（状态标签）、**Avatar**（用户头像）。
它们不像 Dialog/Tabs 那样依赖复杂交互，但都体现了 shadcn 一致的「薄封装 + data-slot + Tailwind 变量」思路。

---

## 一、现象：各管一摊

- **Table**：把行列数据排成表格，支持表头/表尾/标题/单元格对齐。
- **Badge**：一行小标签，用颜色区分语义（默认 / 次要 / 危险 / 描边）。
- **Avatar**：圆形头像，优先显示图片，加载失败或无图时回退到首字母。

> 它们常组合使用：Table 的「状态列」里塞一个 Badge，用户列里塞一个 Avatar——这是后台管理页最常见的搭配。

---

## 二、原理：各自背后的机制

### 1. Table —— 只是语义化标签 + 一层容器

`table.tsx` 几乎是「原生 `<table>` 标签换皮」：每个子组件对应一个原生标签（`thead`/`tbody`/`tr`/`th`/`td`/`caption`），唯一额外做的是给最外层套了一个 `overflow-x-auto` 容器（`data-slot="table-container"`），让窄屏能横向滚动。

值得学的几个 Tailwind 技巧：

- `[&_tr]:border-b`：**后代选择器语法**，给所有 `<tr>` 加底边框（不用写 JS 遍历）。
- `whitespace-nowrap`：防止单元格内容换行撑破布局。
- `text-right`：金额等数字右对齐。

> 这些「用 Tailwind 选择器一次性作用到子元素」的写法，在 shadcn 组件里到处都是，是避免写额外 CSS 的关键。

### 2. Badge —— cva 变体 + `asChild`

`badge.tsx` 和单元 03 的 Button 几乎同构：用 `cva` 声明 `default/secondary/destructive/outline` 四个变体，并支持 `asChild`——这样 `variant="outline"` 的样式能直接套在 `<a>` 上（通过 Radix `Slot` 渲染子元素本身）。

```tsx
const badgeVariants = cva("…基础类…", {
  variants: {
    variant: {
      default:  "border-transparent bg-primary text-primary-foreground …",
      secondary:"border-transparent bg-secondary text-secondary-foreground …",
      destructive:"border-transparent bg-destructive text-white …",
      outline:  "text-foreground …",
    },
  },
  defaultVariants: { variant: "default" },
})
```

> 注意 `destructive` 用的是 `text-white` 而不是 `text-destructive-foreground`——因为危险色背景足够深，白字对比更稳。这是 shadcn 在「可读性」上做的微调。

### 3. Avatar —— Radix 提供「图片失败兜底」

`avatar.tsx` 基于 `@radix-ui/react-avatar`，它解决了一个原生 `<img>` 解决不了的问题：**图片加载失败时自动显示 Fallback**。

```tsx
<Avatar>
  <AvatarImage src="..." alt="..." />     {/* 加载成功才显示 */}
  <AvatarFallback>CN</AvatarFallback>      {/* 图片未加载/失败时的兜底 */}
</Avatar>
```

Radix 在内部监听 `<img>` 的 `load` / `error` 事件来切换显示哪一层。你不用写任何 `onError` 逻辑。

---

## 三、代码：怎么用

```tsx
// Table：标准结构，状态列里嵌 Badge
<Table>
  <TableCaption>发票列表</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>状态</TableHead>
      <TableHead className="text-right">金额</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell><Badge variant="destructive">未付</Badge></TableCell>
      <TableCell className="text-right">¥350</TableCell>
    </TableRow>
  </TableBody>
</Table>

// Avatar：图片 + 兜底
<Avatar>
  <AvatarImage src="https://..." alt="@user" />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>

// Badge：直接标状态
<Badge variant="secondary">待处理</Badge>
```

---

## 四、为什么：两个容易踩的坑

1. **Table 外层有横向滚动容器**：不要把 Table 直接塞进固定宽度的 flex 容器而不给它空间，否则可能被压扁。需要滚动时用外层容器即可。
2. **Avatar 一定要配 Fallback**：图片地址可能是用户上传的脏数据或网络失败。没有 Fallback，加载失败时会出现一个空圆圈——用首字母兜底体验最好。

---

## 运行方式

```bash
cd unit-12-table-avatar
pnpm install
pnpm dev      # 查看表格、状态 Badge、头像回退效果
# 或 pnpm build 做生产构建校验
```

> 本单元依赖 `@radix-ui/react-avatar@1.2.6`（Avatar 兜底）与 `class-variance-authority@0.7.1` + `@radix-ui/react-slot@1.3.3`（Badge 变体 + asChild）。
