import { useState } from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarGroupAction,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarTrigger,
  SidebarInset,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  Home,
  Users,
  FolderOpen,
  Settings,
  ChevronRight,
  Plus,
  Search,
  Bell,
  LayoutDashboard,
} from "lucide-react";

// ── 导航数据：集中配置，和 UI 解耦 ──
const mainNav = [
  {
    title: "平台",
    items: [
      { title: "仪表盘", icon: LayoutDashboard, url: "#", isActive: true },
      {
        title: "团队",
        icon: Users,
        url: "#",
        items: [
          { title: "产品团队", url: "#" },
          { title: "工程团队", url: "#" },
          { title: "设计团队", url: "#" },
        ],
      },
    ],
  },
  {
    title: "项目",
    items: [
      { title: "项目管理", icon: FolderOpen, url: "#" },
      { title: "搜索", icon: Search, url: "#" },
      { title: "设置", icon: Settings, url: "#" },
    ],
  },
];

// ── 递归渲染菜单 ──
function NavMenu({ items }: { items: typeof mainNav }) {
  return items.map((group) => (
    <SidebarGroup key={group.title}>
      <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
      <SidebarGroupAction
        title="新建"
        onClick={() => alert(`新建 ${group.title} 项目`)}
      >
        <Plus className="size-4" />
      </SidebarGroupAction>
      <SidebarGroupContent>
        <SidebarMenu>
          {group.items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={"isActive" in item ? item.isActive : false}
                tooltip={item.title}
              >
                <a href={item.url}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
              {"items" in item && item.items && (
                <SidebarMenuSub>
                  {item.items.map((sub) => (
                    <SidebarMenuSubItem key={sub.title}>
                      <SidebarMenuSubButton asChild>
                        <a href={sub.url}>{sub.title}</a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  ));
}

// ── 主内容区域：展示 Breadcrumb 和 Separator ──
function MainContent() {
  const [activeSection, setActiveSection] = useState("breadcrumb");

  return (
    <SidebarInset>
      {/* ── 页面顶栏：SidebarTrigger + 面包屑 ── */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">
                <Home className="size-3.5" />
                首页
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">布局组件</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {activeSection === "breadcrumb"
                  ? "面包屑导航"
                  : activeSection === "separator"
                    ? "分割线"
                    : "概览"}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* 右侧操作 */}
        <div className="ml-auto flex items-center gap-2">
          <button
            className="hover:bg-accent rounded-md p-1.5 transition-colors"
            title="通知"
          >
            <Bell className="size-4" />
          </button>
          <button
            className="hover:bg-accent rounded-md p-1.5 transition-colors"
            title="设置"
          >
            <Settings className="size-4" />
          </button>
        </div>
      </header>

      {/* ── 页面内容 ── */}
      <div className="flex flex-1 flex-col gap-6 p-6">
        {/* 分区切换标签 */}
        <nav className="flex gap-2">
          {(
            [
              { key: "breadcrumb", label: "面包屑 Breadcrumb" },
              { key: "separator", label: "分割线 Separator" },
              { key: "sidebar-variant", label: "Sidebar 变体说明" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveSection(tab.key)}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                activeSection === tab.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <Separator />

        {/* ── Breadcrumb 演示 ── */}
        {activeSection === "breadcrumb" && <BreadcrumbDemo />}
        {/* ── Separator 演示 ── */}
        {activeSection === "separator" && <SeparatorDemo />}
        {/* ── Sidebar 变体说明 ── */}
        {activeSection === "sidebar-variant" && <SidebarVariantDemo />}
      </div>
    </SidebarInset>
  );
}

// ── Breadcrumb 演示 ──
function BreadcrumbDemo() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-lg font-semibold mb-3">基础用法</h2>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">首页</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">文档</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>当前页</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </section>

      <Separator />

      <section>
        <h2 className="text-lg font-semibold mb-3">带图标 + 自定义分隔符</h2>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">
                <Home className="size-3.5" />
                首页
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="size-3.5" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">用户管理</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="size-3.5" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>用户详情</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </section>

      <Separator />

      <section>
        <h2 className="text-lg font-semibold mb-3">过多项时使用省略号</h2>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">首页</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbEllipsis />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">模块B</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>当前页</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </section>
    </div>
  );
}

// ── Separator 演示 ──
function SeparatorDemo() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-lg font-semibold mb-3">水平分割线</h2>
        <div className="space-y-4 bg-card border rounded-lg p-6">
          <div>
            <h3 className="font-medium">第一部分</h3>
            <p className="text-muted-foreground text-sm mt-1">内容区域 A</p>
          </div>
          <Separator />
          <div>
            <h3 className="font-medium">第二部分</h3>
            <p className="text-muted-foreground text-sm mt-1">内容区域 B</p>
          </div>
          <Separator />
          <div>
            <h3 className="font-medium">第三部分</h3>
            <p className="text-muted-foreground text-sm mt-1">内容区域 C</p>
          </div>
        </div>
      </section>

      <Separator />

      <section>
        <h2 className="text-lg font-semibold mb-3">垂直分割线</h2>
        <div className="flex h-20 items-center gap-3 bg-card border rounded-lg p-6">
          <span className="text-sm">左侧内容</span>
          <Separator orientation="vertical" />
          <span className="text-sm">中间内容</span>
          <Separator orientation="vertical" />
          <span className="text-sm">右侧内容</span>
        </div>
      </section>
    </div>
  );
}

// ── Sidebar 变体说明 ──
function SidebarVariantDemo() {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-lg font-semibold mb-2">Sidebar 的三种变体</h2>
        <p className="text-muted-foreground text-sm mb-4">
          Sidebar 通过{" "}
          <code className="bg-muted px-1 rounded text-xs">variant</code> 和{" "}
          <code className="bg-muted px-1 rounded text-xs">collapsible</code>{" "}
          两个属性控制外观和行为
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="border rounded-lg p-4 space-y-2">
            <h3 className="font-semibold text-sm">
              variant: &ldquo;sidebar&rdquo;（默认）
            </h3>
            <p className="text-muted-foreground text-xs">
              标准侧边栏，附着在屏幕边缘，有一条边框与内容区分隔。
              <br />
              collapsible: offcanvas → 完全隐藏到屏幕外
              <br />
              collapsible: icon → 折叠为图标宽度
            </p>
          </div>
          <div className="border rounded-lg p-4 space-y-2">
            <h3 className="font-semibold text-sm">
              variant: &ldquo;floating&rdquo;
            </h3>
            <p className="text-muted-foreground text-xs">
              浮动侧边栏，有圆角和阴影，悬浮在内容上方。适合需要视差效果的布局。
            </p>
          </div>
          <div className="border rounded-lg p-4 space-y-2">
            <h3 className="font-semibold text-sm">
              variant: &ldquo;inset&rdquo;
            </h3>
            <p className="text-muted-foreground text-xs">
              内嵌侧边栏，和内容区域无缝拼接。需要配合 SidebarInset 使用，
              内容区会自动产生圆角和间距。
            </p>
          </div>
          <div className="border rounded-lg p-4 space-y-2">
            <h3 className="font-semibold text-sm">快捷键支持</h3>
            <p className="text-muted-foreground text-xs">
              按下{" "}
              <kbd className="bg-muted px-1 rounded text-xs">Ctrl/Cmd + B</kbd>{" "}
              可快速切换侧边栏展开/折叠。 此功能由 SidebarProvider
              全局注册，无需额外配置。
            </p>
          </div>
        </div>
      </section>

      <Separator />

      <section>
        <h2 className="text-lg font-semibold mb-2">
          设计令牌（CSS Variables）
        </h2>
        <p className="text-muted-foreground text-sm mb-4">
          Sidebar 拥有独立的 CSS 变量体系，可脱离主主题独立配置
        </p>
        <div className="bg-muted rounded-lg p-4 font-mono text-xs space-y-1">
          <div>--sidebar: 背景色</div>
          <div>--sidebar-foreground: 文字色</div>
          <div>--sidebar-primary: 主色（选中态）</div>
          <div>--sidebar-primary-foreground: 主色上的文字</div>
          <div>--sidebar-accent: 强调色（悬停态）</div>
          <div>--sidebar-accent-foreground: 强调色上的文字</div>
          <div>--sidebar-border: 边框色</div>
          <div>--sidebar-ring: 聚焦环色</div>
        </div>
      </section>
    </div>
  );
}

// ══════════════════════════════════════════════════════
// App 入口：用 SidebarProvider 包裹整页布局
// ══════════════════════════════════════════════════════
export default function App() {
  return (
    <SidebarProvider defaultOpen>
      {/* Sidebar：默认靠左 + offcanvas 折叠模式 */}
      <Sidebar side="left" collapsible="icon" variant="sidebar">
        <SidebarHeader className="flex items-center gap-2 px-2 pt-4">
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex size-8 items-center justify-center rounded-md font-semibold text-sm">
            L
          </div>
          <span className="font-semibold group-data-[collapsible=icon]:hidden">
            Learn UI
          </span>
        </SidebarHeader>

        <SidebarContent>
          <NavMenu items={mainNav} />
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="用户设置">
                <Settings />
                <span>设置</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      <MainContent />
    </SidebarProvider>
  );
}
