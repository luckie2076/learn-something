# 组件库——从零手写 CSS 组件

> 通过从零实现一套外观类似 shadcn/ui 的组件库，系统学习 CSS 布局、样式、定位、动画等核心知识。
>
> **技术栈**：React 19 + TailwindCSS 4 + Vite + 纯 JavaScript  
> **设计原则**：不依赖任何第三方 UI 库，所有交互逻辑和样式全部手写

---

## 学习路径

| 阶段 | Unit | 组件 | 核心 CSS 知识 | 关键 React 技巧 |
|------|------|------|-------------|----------------|
| 🟢 入门 | 01 | Button | 伪类状态 (:hover/:active/:disabled)、变体模式、尺寸系统 | props.children、className 合并 |
| | 02 | Input | :focus 态、Flex 插槽布局 (prefix/suffix) | forwardRef、受控组件 |
| | 03 | Badge | 颜色变体方案、inline-block 布局 | 简单的对象映射模式 |
| | 04 | Card | 复合布局、padding/间距系统、BEM 风格拆分 | 复合组件模式 |
| 🟡 进阶 | 05 | Tabs | Flex 布局、状态驱动样式、CSS transition 动画 | useState、条件渲染 |
| | 06 | Accordion | max-height trick、overflow:hidden、transition 折叠动画 | useRef、动态计算高度 |
| 🔴 挑战 | 07 | Dropdown Menu | 绝对定位、z-index 层叠、CSSTransform 动画 | createPortal、useEffect、事件委托 |
| | 08 | Dialog | fixed 定位、遮罩层、scroll lock、入场/离场动画 | createPortal、body overflow 控制 |
| 🟣 布局 | 09 | Sheet | CSS Transform translate、slide-in 动画、Portal | createPortal、ESC 键监听 |
| | 10 | Sidebar | CSS Grid 双栏布局、Flexbox、sticky 定位 | Context 共享状态、折叠动画 |
| | 11 | Split Pane | Flex 百分比分栏、拖拽交互、鼠标事件 | useRef、mousemove/mouseup 监听 |

---

## CSS 知识点地图

```
CSS 基础样式
├── 01 Button ─── 伪类 (:hover, :active, :focus, :disabled)
├── 02 Input  ─── :focus-visible, placeholder, appearance
├── 03 Badge  ─── 颜色变量, inline-block
├── 04 Card   ─── border-radius, shadow, 间距系统

CSS 动画
├── 05 Tabs     ─── transition (指示器滑动)
├── 06 Accordion ─── transition + max-height (折叠展开)
├── 07 Dropdown ─── opacity + transform (淡入上移)
├── 08 Dialog   ─── opacity + scale (淡入缩放) + overlay
└── 09 Sheet    ─── transform translate (滑入滑出)

CSS 定位
├── 07 Dropdown  ─── absolute + z-index + transform
├── 08 Dialog    ─── fixed + inset-0 + z-index 层级
└── 09 Sheet     ─── fixed + inset + Portal 挂载

CSS 布局
├── 04 Card     ─── Flex 垂直布局
├── 05 Tabs     ─── Flex 水平布局 + gap
├── 10 Sidebar  ─── CSS Grid (双栏) + Flexbox (内部) + sticky
└── 11 SplitPane ─── Flex 百分比分栏 + 动态 flex-basis

React 交互模式
├── 05 Tabs      ─── useState 驱动 UI
├── 06 Accordion ─── useRef + scrollHeight 动态计算
├── 07 Dropdown  ─── createPortal + click outside 检测
├── 08 Dialog    ─── createPortal + body scroll lock
├── 09 Sheet     ─── createPortal + ESC/遮罩关闭 + 焦点管理
├── 10 Sidebar   ─── Context 共享折叠状态 + Transition 动画
└── 11 SplitPane ─── useRef + 原生鼠标拖拽事件 (mousedown/move/up)
```

---

## 快速运行

每个 unit 都是一个独立项目：

```bash
cd component-library/unit-01-button
pnpm install
pnpm dev
```

---

## 免责声明

本项目完全出于**教学目的**，通过从零手写组件来学习 CSS。实际项目中建议直接使用 shadcn/ui 或 Radix UI 等成熟的组件库。
