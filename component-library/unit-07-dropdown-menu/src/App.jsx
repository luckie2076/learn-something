import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "./components/DropdownMenu.jsx"

function Section({ title, children }) {
  return (
    <section className="mb-10">
      <h2 className="mb-4 text-lg font-semibold text-zinc-700">{title}</h2>
      {children}
    </section>
  )
}

export default function App() {
  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">
        Unit 07 · Dropdown Menu 组件
      </h1>
      <p className="mb-8 text-zinc-500">
        学习绝对定位、z-index 层叠、createPortal、click outside 检测
      </p>

      {/* ---- 基础菜单 ---- */}
      <Section title="基础下拉菜单">
        <DropdownMenu>
          <DropdownMenuTrigger>打开菜单</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>我的账号</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => alert("个人信息")}>
              个人信息
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => alert("账号设置")}>
              账号设置
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => alert("通知")}>
              通知
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => alert("退出登录")}>
              退出登录
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Section>

      {/* ---- 多菜单共存 ---- */}
      <Section title="多个下拉菜单共存（互不影响）">
        <div className="flex gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger>文件</DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => alert("新建")}>
                新建文件
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => alert("打开")}>
                打开文件
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => alert("保存")}>
                保存
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger>编辑</DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => alert("撤销")}>
                撤销
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => alert("重做")}>
                重做
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => alert("剪切")}>
                剪切
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => alert("复制")}>
                复制
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => alert("粘贴")}>
                粘贴
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Section>

      {/* ---- 原理拆解 ---- */}
      <Section title="原理拆解（7 个关键点）">
        <div className="space-y-2 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600">
          <p><strong>1. absolute 定位</strong> — 菜单面板脱离文档流，用 getBoundingClientRect 计算触发按钮位置后放置</p>
          <p><strong>2. z-index: 50</strong> — 确保菜单在页面其他元素上方（层叠上下文）</p>
          <p><strong>3. createPortal</strong> — 将菜单渲染到 document.body，避免被父级 overflow:hidden 裁剪</p>
          <p><strong>4. click outside</strong> — 监听 document mousedown，判断点击目标是否在菜单/触发按钮之外</p>
          <p><strong>5. 翻转逻辑</strong> — 如果下方空间不够，自动翻转到触发按钮上方</p>
          <p><strong>6. 点击菜单项关闭</strong> — DropdownMenuItem 点击后调用 setOpen(false)</p>
          <p><strong>7. 多菜单互不干扰</strong> — 每个 DropdownMenu 有独立的 Context 和 state</p>
        </div>
      </Section>

      {/* ---- 滚动测试区域 ---- */}
      <Section title="滚动容器中的下拉菜单（Portal 不会被裁剪）">
        <div className="h-40 overflow-auto rounded-lg border border-zinc-200 p-4">
          <p className="mb-4 text-sm text-zinc-400">
            这个容器设置了 overflow:auto，但菜单通过 Portal 渲染到了 body，
            所以不会被裁剪。试试点击下方按钮：
          </p>
          <DropdownMenu>
            <DropdownMenuTrigger>不会被裁剪的菜单</DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>选项 1</DropdownMenuItem>
              <DropdownMenuItem>选项 2</DropdownMenuItem>
              <DropdownMenuItem>选项 3</DropdownMenuItem>
              <DropdownMenuItem>选项 4</DropdownMenuItem>
              <DropdownMenuItem>选项 5</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* 填充空间让容器出现滚动条 */}
          <div className="mt-4 h-20" />
          <p className="text-xs text-zinc-300">滚动到底部了</p>
        </div>
      </Section>
    </main>
  )
}
