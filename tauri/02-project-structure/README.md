# 单元 02 · 项目结构与配置

> Tauri 教学系列第 2 课。本单元目标：**读透 `tauri.conf.json`，理解 Builder 生命周期与 dev/build 两种模式**。
> 对应官方文档：[Tauri 2 · 配置](https://v2.tauri.org.cn/develop/configuration-files/)

本目录基于单元 01 的骨架，改名并重新配置。请先 `pnpm install` 再 `pnpm tauri dev`。

---

## 1. 一张图看懂：一个 Tauri 项目 = 两个工程

```
┌─ 前端工程（你熟悉的 Vite + React）────────────────────┐
│ package.json     前端依赖与脚本                        │
│ vite.config.ts   Vite 配置（端口固定 1420）            │
│ index.html / src/  页面与组件                         │
└─────────────────────────────────────────────────────┘
┌─ 后端工程（Rust Cargo 项目，藏在 src-tauri/ 里）─────┐
│ Cargo.toml       Rust 依赖（tauri 等）                │
│ build.rs         tauri-build 构建脚本（生成配置代码）  │
│ tauri.conf.json  应用配置（前后端的「婚约」）          │
│ capabilities/    权限声明（单元 05 详解）              │
│ icons/           应用图标                             │
│ src/main.rs      程序入口（极薄）                     │
│ src/lib.rs       核心逻辑（Builder + 命令）           │
└─────────────────────────────────────────────────────┘
```

> **理解要点**：`tauri dev` 时，Vite 先启动开发服务器，Cargo 再编译 Rust 并
> 打开窗口加载 `devUrl` 的页面。所以前端代码在浏览器里，Rust 代码在进程里，
> 两者靠 IPC 通信。

---

## 2. `tauri.conf.json` 全字段解析

Tauri 2 的配置文件放在 `src-tauri/tauri.conf.json`，本单元逐字段拆解：

```jsonc
{
  "$schema": "https://schema.tauri.app/config/2", // 编辑器智能提示，无运行作用
  "productName": "structure",       // 产品名：窗口菜单、安装包名都依赖它
  "version": "0.1.0",               // 应用版本（打包时写入安装包）
  "identifier": "com.example.unit02", // 应用唯一 ID（反向域名，打包签名必填，不可随意改）

  "build": {
    "beforeDevCommand": "pnpm dev",  // 开发模式：先跑这个（启动 Vite）
    "devUrl": "http://localhost:1420", // 开发模式：窗口加载的地址
    "beforeBuildCommand": "pnpm build", // 打包模式：先跑这个（编译前端）
    "frontendDist": "../dist"        // 打包模式：窗口加载的静态目录
  },

  "app": {
    "windows": [                     // 启动时创建哪些窗口（数组可多窗口）
      {
        "title": "Tauri 单元 02 · 项目结构",
        "width": 800,                // 窗口宽高（像素）
        "height": 600
      }
    ],
    "security": {
      "csp": null                    // 内容安全策略；null = 关闭（生产环境建议配置）
    }
  },

  "bundle": {
    "active": true,                  // 是否参与打包
    "targets": "all",                // 打包目标：dmg / app / msi…（单元 08）
    "icon": [                        // 各平台图标文件（单元 08 用 tauri icon 生成）
      "icons/32x32.png",
      "icons/128x128.png",
      "icons/128x128@2x.png",
      "icons/icon.icns",             // macOS
      "icons/icon.ico"               // Windows
    ]
  }
}
```

> **与 Tauri 1 的差异**（很多人踩坑）：Tauri 2 里 `identifier` 从
> `tauri.bundle` 移到了顶层；`distDir`/`devPath` 更名为 `frontendDist`/`devUrl`；
> 窗口配置从 `tauri.windows` 移到 `app.windows`。

**动手实验**（本单元演示代码就是为此设计的）：

1. 改 `productName` → 重启 dev → 前端读到的应用名变化
2. 改 `app.windows[0].title` → 重启 dev → 窗口标题变化
3. 改 `app.windows[0].width` → 重启 dev → 窗口尺寸变化

---

## 3. `Cargo.toml`：Rust 侧的关键依赖

```toml
[dependencies]
tauri = { version = "2", features = [] }  # Tauri 核心框架
tauri-plugin-opener = "2"                 # 模板自带的插件（用系统浏览器打开链接）
serde = { version = "1", features = ["derive"] }  # 序列化（IPC 契约）
serde_json = "1"

[build-dependencies]
tauri-build = { version = "2", features = [] }  # 构建脚本依赖
```

- `tauri` 版本写 `"2"` 表示使用 2.x 最新版，与前端 `@tauri-apps/api@^2` **必须同大版本**，否则 IPC 不兼容；
- `serde` 用于在 Rust 与 JS 之间序列化数据（单元 03 详解）。

## 4. `main.rs` 与 `lib.rs`：为什么拆成两个文件？

```
main.rs              lib.rs
┌──────────┐        ┌─────────────────────────┐
│ fn main()│ ─────▶ │ pub fn run() {           │
│ { lib::run() }    │   tauri::Builder::default()  ← 应用构造器
└──────────┘        │     .plugin(...)          ← 挂插件
                    │     .invoke_handler(...)  ← 注册命令
                    │     .run(...)             ← 启动应用
                    │ }                        │
                    └─────────────────────────┘
```

- **`main.rs` 只做一件事**：调用 `lib.rs` 的 `run()`。这是 Tauri 官方推荐的拆分，目的是让逻辑放在库（lib）里，便于**移动端复用**（iOS/Android 的入口不同但共用 `run()`）；
- `Builder::default()` 是 Tauri 应用的中枢，后续单元的「命令」「插件」「事件」都在这里挂载；
- `#[cfg_attr(mobile, tauri::mobile_entry_point)]` 是给移动端用的宏，桌面端忽略；
- crate 名与 lib 名的关系：`Cargo.toml` 里 `[lib] name = "structure_lib"`，所以 `main.rs` 里写 `structure_lib::run()`。改包名要同步改这里。

## 5. dev 模式 vs build 模式

| | `pnpm tauri dev` | `pnpm tauri build` |
| --- | --- | --- |
| 前端 | Vite 开发服务器，**热更新** | 编译成静态文件 → `../dist` |
| 加载 | 窗口加载 `devUrl` | 窗口加载 `frontendDist` |
| Rust | debug 编译（快） | release 编译（慢、优化） |
| 产物 | 调试窗口 | 安装包（单元 08） |
| 用途 | 开发调试 | 发布分发 |

> 判断当前模式：Rust 里可用 `#[cfg(debug_assertions)]`，前端可用
> `window.__TAURI_INTERNALS__` 是否存在。

---

## 6. 本单元小结

- [x] 分清前端工程与 `src-tauri/` 后端工程
- [x] 逐字段理解 `tauri.conf.json`（identifier 顶层、build 四件套、app.windows、bundle）
- [x] 知道 `Cargo.toml` 关键依赖与版本一致性要求
- [x] 理解 `main.rs` / `lib.rs` 的拆分原因与 Builder 生命周期
- [x] 区分 dev 模式与 build 模式

**下一步** → [单元 03 · 命令系统](../03-commands/)：前端如何调用 Rust 函数（invoke）、参数、返回值与错误处理。
