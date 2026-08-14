# 单元 01 · 环境搭建与 Hello World

> Tauri 教学系列第 1 课。本单元目标：**装好环境，跑通第一个 Tauri 应用**。
> 对应官方文档：[Tauri 2 · 开始](https://v2.tauri.org.cn/start/)

---

## 1. Tauri 是什么？为什么用 Tauri？

Tauri 是一个用来构建**桌面应用**（macOS / Windows / Linux）的框架，它的核心思路是：

```
┌─────────────────────────────┐
│  前端（WebView）              │  你用 React/Vue/原生 HTML 写界面
│  React 19 + Vite            │
├─────────────────────────────┤
│  IPC 通信层                  │  invoke 命令 / 事件
├─────────────────────────────┤
│  后端（Rust 核心）            │  系统能力：文件、窗口、网络…
│  tauri crate               │
└─────────────────────────────┘
```

**为什么值得学 Tauri（对比 Electron）：**

| 维度 | Tauri | Electron |
| ---- | ----- | -------- |
| 内核 | Rust（编译型） | Node.js（解释型） |
| 前端载体 | 系统自带 WebView | 内置 Chromium |
| 安装包体积 | 约 3~10 MB | 约 100 MB 起 |
| 内存占用 | 明显更低 | 较高 |
| 系统 API | 通过 Rust 访问，权限可控 | 直接可用但边界模糊 |
| 语言栈 | Rust + JS/TS | 只有 JS/TS |

> Tauri 的前端"浏览器"是你操作系统自带的 WebView：
> macOS 用 WKWebView，Windows 用 WebView2，Linux 用 WebKitGTK。
> 所以它**不打包浏览器**，这是体积小的根本原因。

本课程使用 **Tauri 2.x**（当前稳定大版本）+ **React 19 + TypeScript** 前端。
假设你已学完本仓库的 `rust/` 科目（本课程不再重复 Rust 基础，但遇到关键 Rust 代码仍会讲解）。

---

## 2. 环境检查

macOS 上需要三样东西，本机已全部就绪，你可以自行核对：

```bash
# 1. Xcode Command Line Tools（Tauri 编译 Rust 及调用系统库需要）
xcode-select --install        # 若提示已安装则跳过

# 2. Rust 工具链（rustc + cargo，Tauri 后端）
rustc --version               # rustc 1.97.x 或更新

# 3. Node.js 与 pnpm（前端工具链）
node -v                      # Node 20+ 均可
pnpm -v                      # 本仓库统一使用 pnpm
```

> Tauri 2 要求 Rust **1.77.2+**，Node.js **20+**。
> 系统自带的 WKWebView 无需单独安装，这是 macOS 的天然优势。

如果 Rust 缺失，用官方安装器：

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

---

## 3. 用脚手架创建项目

Tauri 官方提供 `create-tauri-app` 脚手架（类似 `pnpm create vite`），
本目录正是由它生成的：

```bash
pnpm create tauri-app@latest 01-environment \
  --template react-ts \
  --manager pnpm \
  --identifier com.example.unit01 \
  --yes
```

参数含义：

| 参数 | 含义 |
| ---- | ---- |
| `--template react-ts` | 前端模板：React + TypeScript |
| `--manager pnpm` | 包管理器：pnpm |
| `--identifier` | 应用唯一标识（反向域名格式，影响打包） |
| `--yes` | 跳过交互式提问 |

> 官方支持的模板还有 `vanilla`、`vue-ts`、`svelte` 等，本项目统一用 react-ts。

---

## 4. 安装依赖

脚手架只生成了骨架，需要安装前后端两套依赖：

```bash
# 前端依赖（Vite + React + @tauri-apps/api + @tauri-apps/cli）
pnpm install

# Rust 后端依赖（tauri crate 及其编译依赖）
cd src-tauri && cargo fetch
```

> `cargo fetch` 会下载并**编译** Rust 依赖，首次运行 `pnpm tauri dev` 时
> 编译耗时较长（通常几分钟），属正常现象；后续会走增量编译，明显变快。

---

## 5. 跑起来：`pnpm tauri dev`

在项目根目录（本目录）执行：

```bash
pnpm tauri dev
```

这条命令同时做了两件事：

1. 启动 **Vite 开发服务器**（`http://localhost:1420`），负责前端热更新；
2. 用 `cargo build` **编译 Rust 后端**，并打开一个原生窗口加载前端页面。

看到窗口弹出、能正常交互，说明整个环境链路已打通。
输入名字点击 **Greet**，下方会出现来自 **Rust 命令** 的回应——
这是你与 Tauri 的第一次前后端对话（`invoke` 的细节在单元 03 展开）。

> `pnpm tauri dev` 中，Vite 是**开发模式**的宿主；打包后前端代码被编译成
> 静态文件交给 WebView 直接加载（见单元 02 的 `frontendDist` 字段）。

---

## 6. 生成的项目结构速览

这是本目录（也是之后每个单元）的骨架，先混个脸熟：

```
01-environment/
├── index.html              # 前端 HTML 入口
├── package.json            # 前端依赖与脚本
├── vite.config.ts          # Vite 配置（固定端口 1420，供 tauri dev 对接）
├── src/                    # 前端源码（React + TS）
│   ├── main.tsx            # React 挂载入口
│   ├── App.tsx             # 主组件（本单元演示代码）
│   └── App.css
└── src-tauri/              # 后端源码（Rust），这才是 Tauri 的核心
    ├── Cargo.toml          # Rust 依赖（tauri 等）
    ├── build.rs            # 构建脚本（tauri-build，自动生成配置代码）
    ├── tauri.conf.json     # Tauri 应用配置（单元 02 全字段解析）
    ├── capabilities/       # 权限能力声明（单元 05 详解）
    ├── icons/              # 应用图标（单元 08 用 tauri icon 生成）
    └── src/
        ├── main.rs         # 入口：调用 lib.rs 的 run()
        └── lib.rs          # 核心：Builder + 命令注册
```

**快速记忆法**：`src/` 是"浏览器里的 JS"，`src-tauri/src/` 是"操作系统里的 Rust"，`tauri.conf.json` 是两者的"婚约"。

---

## 7. 本单元小结

- [x] 理解 Tauri 的架构：WebView 前端 + Rust 后端 + IPC 通信
- [x] 确认三件套环境：Xcode CLT / Rust / Node + pnpm
- [x] 用 `create-tauri-app` 生成项目
- [x] 跑通 `pnpm tauri dev`，看到原生窗口
- [x] 熟悉目录结构，分清前端与后端各自的职责

**下一步** → [单元 02 · 项目结构与配置](../02-project-structure/)：
逐字段解读 `tauri.conf.json`，理解 Builder 的生命周期与 dev/build 模式差异。
