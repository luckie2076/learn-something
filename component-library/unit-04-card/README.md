# Unit 04 · Card 组件

## 核心 CSS 知识点

### 1. 复合组件模式

Card 不是一个单一组件，而是由 Card、CardHeader、CardContent、CardFooter 等子组件组合而成：

```jsx
<Card>
  <CardHeader>
    <CardTitle>标题</CardTitle>
    <CardDescription>描述</CardDescription>
  </CardHeader>
  <CardContent>内容区域</CardContent>
  <CardFooter>底部操作区</CardFooter>
</Card>
```

这种模式的优势：
- 每个子组件独立封装自己的样式，职责单一
- 使用方可以自由组合（只要 Header、只保留 Content 都可以）
- 易于扩展（比如增加 CardImage、CardDivider）

### 2. 间距系统

| 属性 | Tailwind 类 | 效果 |
|------|-----------|------|
| 外层 padding | `p-6` | CardHeader/CardContent/CardFooter 统一 24px 内边距 |
| 标题间距 | `space-y-1.5` | CardHeader 内部垂直间距 6px |
| 内容区紧贴标题 | `pt-0` | CardContent 去掉顶部 padding，紧贴 Header |

### 3. border-radius + box-shadow

```css
rounded-xl border border-zinc-200 bg-white shadow-sm
```

- `rounded-xl` — 12px 圆角，比 `rounded-lg` 更柔和（shadcn/ui 风格）
- `border border-zinc-200` — 浅灰边框，替代纯阴影的视觉分隔
- `shadow-sm` — 微阴影增加层次感

---

## 运行

```bash
pnpm install && pnpm dev
```
