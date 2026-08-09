import { useState } from "react"
import Sheet from "./components/Sheet.jsx"

function Section({ title, children }) {
  return (
    <section className="rounded-xl border border-zinc-200 p-6 space-y-4">
      <h2 className="text-lg font-semibold text-zinc-800">{title}</h2>
      {children}
    </section>
  )
}

function Btn({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-700 transition-colors cursor-pointer"
    >
      {children}
    </button>
  )
}

export default function App() {
  const [openRight, setOpenRight] = useState(false)
  const [openLeft, setOpenLeft] = useState(false)
  const [openTop, setOpenTop] = useState(false)
  const [openBottom, setOpenBottom] = useState(false)
  const [openForm, setOpenForm] = useState(false)

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* 标题区 */}
      <div className="border-b border-zinc-200 bg-white px-8 py-6">
        <h1 className="text-2xl font-bold text-zinc-900">Sheet · 侧滑面板</h1>
        <p className="mt-1 text-zinc-500 text-sm">
          从屏幕边缘滑出的浮层面板，常用于抽屉导航、筛选面板、详情页等场景。
        </p>
      </div>

      <div className="max-w-3xl mx-auto p-8 space-y-8">
        {/* 基础用法：四个方向 */}
        <Section title="四个滑出方向">
          <p className="text-sm text-zinc-500">
            Sheet 支持 <code className="bg-zinc-100 px-1 rounded">left</code>、
            <code className="bg-zinc-100 px-1 rounded">right</code>、
            <code className="bg-zinc-100 px-1 rounded">top</code>、
            <code className="bg-zinc-100 px-1 rounded">bottom</code> 四个方向。
          </p>
          <div className="flex flex-wrap gap-3">
            <Btn onClick={() => setOpenRight(true)}>右侧面板</Btn>
            <Btn onClick={() => setOpenLeft(true)}>左侧面板</Btn>
            <Btn onClick={() => setOpenTop(true)}>顶部面板</Btn>
            <Btn onClick={() => setOpenBottom(true)}>底部面板</Btn>
          </div>
        </Section>

        {/* 表单场景 */}
        <Section title="筛选表单（右侧滑出）">
          <p className="text-sm text-zinc-500">
            移动端常见的筛选抽屉，点击按钮后从右侧滑入，填写完成后关闭。
          </p>
          <Btn onClick={() => setOpenForm(true)}>打开筛选</Btn>
        </Section>

        {/* 原理拆解 */}
        <Section title="原理拆解">
          <ul className="space-y-3 text-sm text-zinc-600">
            <li>
              <strong className="text-zinc-800">1. CSS Transform</strong>
              <br />
              面板通过 <code className="bg-zinc-100 px-1 rounded">translateX(-100%)</code> /
              <code className="bg-zinc-100 px-1 rounded">translateX(100%)</code> 隐藏在屏幕外，
              打开时变为 <code className="bg-zinc-100 px-1 rounded">translateX(0)</code>。
            </li>
            <li>
              <strong className="text-zinc-800">2. CSS Transition</strong>
              <br />
              <code className="bg-zinc-100 px-1 rounded">transition-transform duration-300 ease-in-out</code> 让
              位移产生平滑的滑入滑出动画效果。
            </li>
            <li>
              <strong className="text-zinc-800">3. createPortal</strong>
              <br />
              使用 React Portal 将 Sheet 渲染到 <code className="bg-zinc-100 px-1 rounded">document.body</code>，
              避免被父容器的 z-index 或 overflow 限制。
            </li>
            <li>
              <strong className="text-zinc-800">4. 遮罩层 + 点击外部关闭</strong>
              <br />
              半透明黑色遮罩覆盖全屏，点击遮罩即关闭面板，符合用户直觉。
            </li>
            <li>
              <strong className="text-zinc-800">5. ESC 关闭 + 焦点管理</strong>
              <br />
              支持键盘 ESC 关闭，打开时自动聚焦面板以支持无障碍访问。
            </li>
          </ul>
        </Section>
      </div>

      {/* ========== Sheet 实例 ========== */}

      <Sheet open={openRight} onClose={() => setOpenRight(false)} side="right">
        <div className="p-6 space-y-4">
          <h3 className="text-lg font-semibold text-zinc-800">右侧面板</h3>
          <p className="text-sm text-zinc-500">从右侧滑入的面板，适合展示详情、设置等。</p>
          <div className="space-y-2">
            {["项目一", "项目二", "项目三"].map((item) => (
              <div key={item} className="px-3 py-2 rounded-md bg-zinc-50 text-sm text-zinc-700">
                {item}
              </div>
            ))}
          </div>
        </div>
      </Sheet>

      <Sheet open={openLeft} onClose={() => setOpenLeft(false)} side="left">
        <div className="p-6 space-y-4">
          <h3 className="text-lg font-semibold text-zinc-800">左侧面板</h3>
          <p className="text-sm text-zinc-500">从左侧滑入的面板，适合导航菜单。</p>
          <nav className="space-y-1">
            {["首页", "产品", "关于", "联系"].map((item, idx) => (
              <a
                key={item}
                href="#"
                className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                  idx === 0
                    ? "bg-zinc-100 text-zinc-900 font-medium"
                    : "text-zinc-600 hover:bg-zinc-50"
                }`}
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
      </Sheet>

      <Sheet open={openTop} onClose={() => setOpenTop(false)} side="top">
        <div className="p-6 space-y-4">
          <h3 className="text-lg font-semibold text-zinc-800">顶部面板</h3>
          <p className="text-sm text-zinc-500">从顶部滑入的面板，适合通知栏、搜索栏等。</p>
        </div>
      </Sheet>

      <Sheet open={openBottom} onClose={() => setOpenBottom(false)} side="bottom">
        <div className="p-6 space-y-4">
          <h3 className="text-lg font-semibold text-zinc-800">底部面板</h3>
          <p className="text-sm text-zinc-500">从底部滑入的面板，适合操作菜单、分享面板。</p>
          <div className="space-y-2">
            {["分享链接", "保存图片", "举报", "取消"].map((action) => (
              <button
                key={action}
                className="w-full px-4 py-3 text-center text-sm rounded-lg bg-zinc-50 hover:bg-zinc-100 transition-colors cursor-pointer"
                onClick={() => setOpenBottom(false)}
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      </Sheet>

      <Sheet open={openForm} onClose={() => setOpenForm(false)} side="right">
        <div className="p-6 space-y-5">
          <h3 className="text-lg font-semibold text-zinc-800">筛选条件</h3>
          <div className="space-y-3">
            <label className="block space-y-1">
              <span className="text-sm font-medium text-zinc-700">价格范围</span>
              <select className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm bg-white">
                <option>全部</option>
                <option>¥0 - ¥100</option>
                <option>¥100 - ¥500</option>
                <option>¥500+</option>
              </select>
            </label>
            <label className="block space-y-1">
              <span className="text-sm font-medium text-zinc-700">排序方式</span>
              <select className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm bg-white">
                <option>综合排序</option>
                <option>价格从低到高</option>
                <option>价格从高到低</option>
                <option>最新发布</option>
              </select>
            </label>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              className="flex-1 px-4 py-2 text-sm font-medium rounded-lg bg-zinc-900 text-white hover:bg-zinc-700 transition-colors cursor-pointer"
              onClick={() => setOpenForm(false)}
            >
              确定
            </button>
            <button
              className="flex-1 px-4 py-2 text-sm font-medium rounded-lg border border-zinc-200 text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer"
              onClick={() => setOpenForm(false)}
            >
              重置
            </button>
          </div>
        </div>
      </Sheet>
    </div>
  )
}
