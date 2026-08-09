# 单元 16 · 布局组件：Sidebar / Breadcrumb / Separator

## 你会学到什么

在 shadcn/ui 中，**布局组件**负责页面的大体框架 —— 侧边栏导航、面包屑路径、视觉分割线。 本单元通过三个难度递进的组件，展示 shadcn/ui 在设计布局组件时使用的核心模式。

---

## 怎么运行

```bash
cd shadcnui/unit-16-layout-components
pnpm install
pnpm dev
```

打开浏览器，你会看到：
- 左侧一个**完整的可折叠侧边栏**（带导航层级、搜索、底部操作）
- 顶栏有**面包屑导航**和**分割线**
- 内容区点击标签可切换查看 Breadcrumb 和 Separator 的独立演示

---

## 分量讲解

### 1. Separator —— 最简单的起点

#### 现象

页面上出现一条细线，把视觉上相关的区域分隔开。有**水平**和**垂直**两种方向。

```tsx
// 水平分割线（默认）
<Separator />

// 垂直分割线
<Separator orientation="vertical" />
```

#### 原理

Separator 的结构极其简单：

```
<SeparatorPrimitive.Root>  ← 来自 @radix-ui/react-separator
  └── 纯 CSS 样式（Tailwind）
```

**三步拆解：**

1. **Radix 原语负责无障碍**  
   `SeparatorPrimitive.Root` 设置了 `decorative` 属性（默认为 `true`），告诉屏幕阅读器"这是纯视觉元素，不需要朗读"。同时支持 `orientation` 属性控制 `aria-orientation`。

2. **shadcn 只加样式**  
   通过 `orientation` 决定渲染 `w-full h-[1px]`（水平）还是 `h-full w-[1px]`（垂直），配合 `bg-border` 上色。

3. **data-slot 属性**  
   `data-slot="separator-root"` 是 shadcn/ui v4 新增的命名约定，方便在 DevTools 中定位组件，不影响任何行为。

> **设计理念：** Radix 提供 accessible 的 HTML 原语，shadcn 只负责"长什么样"。这是 shadcn/ui 组件最基础的公式。

---

### 2. Breadcrumb —— 复合组件 + 语义化 HTML

#### 现象

一串带有 `>` 分隔符的导航路径，如：  
`首页 > 文档 > 当前页`

#### 组件组合

Breadcrumb 是典型的**复合组件**，由多个独立导出的子组件组合而成：

```tsx
<Breadcrumb>              // <nav> — 导航区域
  <BreadcrumbList>        // <ol> — 有序列表
    <BreadcrumbItem>      // <li> — 每一项
      <BreadcrumbLink />  // <a> — 可点击的链接
    </BreadcrumbItem>
    <BreadcrumbSeparator> // <li role="presentation"> — 分隔符
      <ChevronRight />    // 默认图标，可自定义
    </BreadcrumbSeparator>
    <BreadcrumbItem>
      <BreadcrumbPage />  // <span aria-current="page"> — 当前页
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

**关键机制：**

1. **语义化标签**  
   `<nav aria-label="breadcrumb">` → `<ol>` → `<li>` — 屏幕阅读器能正确朗读"面包屑导航，第X项，链接"。

2. **render 函数注入框架路由**  
   `BreadcrumbLink` 接受一个 `render` prop，允许注入 React Router 的 `<Link>` 或 Next.js 的 `<Link>`：
   ```tsx
   <BreadcrumbLink render={<RouterLink to="/docs" />}>
     文档
   </BreadcrumbLink>
   ```
   这让组件与任何路由库解耦 —— shadcn 不预设你用什么。

3. **分隔符的无障碍处理**  
   `BreadcrumbSeparator` 设置了 `role="presentation"` 和 `aria-hidden="true"`，确保屏幕阅读器跳过 `>` 图标。

4. **当前页标记**  
   `BreadcrumbPage` 设置 `aria-current="page"`，告知辅助技术"这就是当前页面"。

---

### 3. Sidebar —— 布局组件的集大成者

Sidebar 是 shadcn/ui 中**最复杂**的组件之一（约 550 行），集成了多种设计模式。

#### 从外到内的层次结构

```
<SidebarProvider>          ← Context 提供者 + 全局快捷键注册
  <Sidebar>                ← 主容器（固定定位 + 折叠动画）
    <SidebarHeader>        ← 顶部粘性区域（放 Logo）
    <SidebarContent>       ← 可滚动主内容
      <SidebarGroup>           ← 逻辑分组
        <SidebarGroupLabel />   ← 分组标题
        <SidebarGroupAction />  ← 分组右侧操作
        <SidebarGroupContent>   ← 分组内容
          <SidebarMenu>             ← <ul> 菜单
            <SidebarMenuItem>       ← <li> 菜单项
              <SidebarMenuButton /> ← 按钮（支持 tooltip + 图标）
              <SidebarMenuSub>      ← 子菜单
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton />
    <SidebarFooter>        ← 底部粘性区域（放用户信息）
    <SidebarRail />        ← 侧边拖拽条
    <SidebarTrigger />     ← 触发按钮（汉堡菜单）
  <main>                   ← 主内容区
```

这是典型的 **"积木式"复合组件** —— 每个子组件职责极其单一，组合方式完全自由。

---

## 核心设计模式深解

### 模式一：Context 驱动状态下发

```tsx
// SidebarProvider 内部创建 Context
const SidebarContext = React.createContext<SidebarContextValue | null>(null)

// 任何深层子组件都能通过 useSidebar() 拿到状态
const { state, toggleSidebar, isMobile } = useSidebar()
```

**为什么需要 Context？**  
Sidebar 的打开/折叠状态需要在 `SidebarTrigger`（往往在顶栏里）、`Sidebar` 自身（决定渲染）、`SidebarMenuButton`（决定 tooltip 是否显示）之间共享。Props drilling 做不到，Context 是唯一解。

**受控 vs 非受控**  
```tsx
// 非受控模式（默认）：内部管理状态
<SidebarProvider defaultOpen={false}>

// 受控模式：外部控制状态（比如把状态存 URL 或 Redux）
<SidebarProvider open={open} onOpenChange={setOpen}>
```
这是 React 表单组件的经典模式，SidebarProvider 内部通过 `openProp ?? _open` 实现了双态支持。

### 模式二：data 属性驱动的 CSS 选择器

Sidebar 的折叠/展开不是 `if/else` 渲染，而是 **CSS 驱动显示/隐藏**：

```html
<!-- 展开态 -->
<div data-slot="sidebar" data-state="expanded" data-collapsible="offcanvas">

<!-- 折叠态（offcanvas 模式） -->
<div data-slot="sidebar" data-state="collapsed" data-collapsible="offcanvas">
```

对应 CSS：
```css
/* 展开时在屏幕内，折叠时滑出屏幕 */
data-[state=collapsed]:-left-[calc(var(--sidebar-width)+2rem)]
data-[state=expanded]:left-0
transition-[left] duration-200 ease-linear
```

**为什么用 data 属性而不是条件渲染？**

| 方式 | 优点 | 缺点 |
|------|------|------|
| `{open && <Sidebar />}` | 简单直接 | 折叠时整个 DOM 树销毁，动画无法实现"滑出"效果 |
| `data-state="collapsed"` | DOM 保留，CSS transition 实现丝滑动画 | 样式复杂度上升 |

shadcn 选择后者，目的是实现 **60fps 的折叠/展开过渡动画**。

### 模式三：group-data 跨层选择器

子组件的样式经常依赖父组件的状态。传统做法是用 props 层层传递 `isCollapsed`，但 Sidebar 选择了 CSS 原生的 `group` 机制：

```html
<!-- 父级标记 group/sidebar -->
<div class="group/sidebar" data-collapsible="icon" data-state="collapsed">

<!-- 子元素用 group-data 读取父级状态 -->
<span class="group-data-[collapsible=icon]:hidden">
  这段文字在图标模式下隐藏
</span>

<!-- 菜单按钮在图标模式下缩小 -->
<div class="group-has-data-[collapsible=icon]/sidebar-wrapper:size-8">
```

**关键技术点：**
- `group/{name}` 创建命名容器查询上下文
- `group-data-[key=value]:{style}` 读取当前组的 data 属性
- `group-has-data-[key=value]/{name}:{style}` 读取祖先组的 data 属性

这让组件树任意深度的子元素都能**只用 CSS** 响应侧边栏状态，无需引入额外的 JS 逻辑。

### 模式四：移动端 vs 桌面端双轨机制

```tsx
const { isMobile } = useSidebar()

if (isMobile) {
  // 移动端：用 Sheet（从屏幕边缘滑出的面板）代替固定侧边栏
  return (
    <Sheet open={openMobile} onOpenChange={setOpenMobile}>
      <SheetContent side="left">...</SheetContent>
    </Sheet>
  )
}

// 桌面端：固定定位的侧边栏，支持折叠
return <div className="fixed ...">...</div>
```

**设计原因：**  
- 桌面端：侧边栏固定在左侧，折叠 = 缩小宽度
- 移动端（≤767px）：没有空间放侧边栏，改为 Sheet 抽屉模式，点击遮罩关闭

`useIsMobile` 通过 `window.matchMedia("(max-width: 767px)")` 自动检测，无需手动传入断点。

### 模式五：设计令牌分层

Sidebar 的色值**独立于主主题**，使用专用的 CSS 变量：

```css
/* 这些变量和 --background、--foreground 是平行的 */
--sidebar: oklch(0.985 0 0);
--sidebar-foreground: #1e293b;
--sidebar-primary: #1e293b;
--sidebar-accent: #f1f5f9;
--sidebar-border: #e2e8f0;
--sidebar-ring: #94a3b8;
```

**为什么分离？**  
- Sidebar 通常是"深色品牌色"背景 + "浅色"文字，和主内容区完全不同
- 独立的设计令牌意味着**换主题时 Sidebar 可以保持品牌色不变**
- 暗色模式切换时可以改变 Sidebar 的变量值，无需改组件代码

### 模式六：持久化 + 快捷键 + Tooltip

三个"使用体验"细节：

**Cookie 持久化**  
```tsx
// 折叠状态写入 cookie，刷新页面后保持
document.cookie = `sidebar_state=${open}; max-age=${60*60*24*7}`
```

**全局快捷键**  
```tsx
React.useEffect(() => {
  const handler = (e) => {
    if (e.key === "b" && (e.metaKey || e.ctrlKey)) {
      toggleSidebar()  // Ctrl/Cmd + B
    }
  }
  window.addEventListener("keydown", handler)
}, [])
```
同时排除了输入框内的触发（`INPUT`、`TEXTAREA`）。

**图标模式下的 Tooltip**  
折叠为图标模式时，`SidebarMenuButton` 会被 `Tooltip` 包裹：
```tsx
// 只在折叠 + 非移动端时显示 tooltip
<TooltipContent hidden={state !== "collapsed" || isMobile}>
  {item.title}
</TooltipContent>
```

---

## 本单元创建的文件总览

```
unit-16-layout-components/
├── index.html                    # 入口 HTML
├── package.json                  # 依赖管理
├── vite.config.ts                # Vite + Tailwind v4 配置
├── tsconfig.json                 # TypeScript 配置
├── components.json               # shadcn/ui 组件配置
├── src/
│   ├── main.tsx                  # React 挂载入口
│   ├── index.css                 # 全局样式 + CSS 变量（含 sidebar 令牌）
│   ├── App.tsx                   # 主应用：完整的管理面板布局演示
│   ├── vite-env.d.ts             # Vite 类型声明
│   ├── lib/
│   │   └── utils.ts              # cn() 工具函数
│   └── components/ui/
│       ├── separator.tsx         # 分割线组件
│       ├── breadcrumb.tsx        # 面包屑导航组件
│       ├── sidebar.tsx           # 侧边栏组件（核心）
│       ├── button.tsx            # 按钮（Sidebar 的依赖）
│       ├── input.tsx             # 输入框（Sidebar 的依赖）
│       ├── sheet.tsx             # 抽屉面板（移动端时用到）
│       ├── tooltip.tsx           # 文字提示（图标模式时用到）
│       └── skeleton.tsx          # 骨架屏（SidebarMenuSkeleton 用到）
└── README.md                     # 本文件
```

---

## 关键要点

| 组件 | 复杂度 | 核心模式 | 依赖的 Radix 原语 |
|------|--------|---------|------------------|
| Separator | ⭐ | Radix 原语 + 样式 | `@radix-ui/react-separator` |
| Breadcrumb | ⭐⭐ | 复合组件 + 语义化 HTML | `@radix-ui/react-slot` |
| Sidebar | ⭐⭐⭐⭐⭐ | Context + data 属性 CSS + 双轨机制 + 设计令牌 | `@radix-ui/react-slot` + `@radix-ui/react-dialog` + `@radix-ui/react-tooltip` |

**一句话总结：** shadcn/ui 的布局组件是一套"预制建筑模块"——Separator 像砖头，Breadcrumb 像楼梯，Sidebar 像整面承重墙。它们分别用最简单、最语义化、最工程的模式解决了"如何分割""如何导航""如何组织"这三个布局核心问题。
