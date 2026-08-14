# Tauri 2 桌面应用开发

> 用 **React 19 + TypeScript + Rust** 构建跨平台桌面应用（macOS / Windows / Linux）。
> 基于 **Tauri 2.x**（当前稳定大版本）与官方文档 [v2.tauri.app](https://v2.tauri.app/) / [v2.tauri.org.cn](https://v2.tauri.org.cn/)。

## 为什么学 Tauri

Tauri 与 Electron 都做桌面应用，但哲学截然不同：

| | Tauri | Electron |
| --- | --- | --- |
| 前端载体 | 系统自带 WebView | 内置 Chromium |
| 后端语言 | Rust（编译型、内存安全） | Node.js |
| 安装包体积 | ~10 MB 级 | ~100 MB 级 |
| 安全模型 | capabilities 权限声明（最小权限） | 无内置 ACL |

如果你已经学完本仓库的 `rust/` 科目，Tauri 是**前端技能与系统能力**的最佳交汇点。

## 学习前提

- ✅ 已完成 `rust/` 科目（后端代码直接写 Rust，本课程不重复基础）
- ✅ 熟悉 React（前端用 React 19，可参考 `react/` 科目）
- ✅ macOS 已安装：Xcode Command Line Tools、Rust、Node 20+ / pnpm

## 课程路线图

按官方核心概念链渐进拆分，**每个单元都是相互完全隔离、可单独运行**的独立 Tauri 项目。

| 单元 | 主题 | 核心内容 |
|------|------|----------|
| [01-environment](./01-environment/) | 环境搭建与 Hello World | 前置依赖、create-tauri-app、tauri dev 首次运行、项目结构速览 |
| [02-project-structure](./02-project-structure/) | 项目结构与配置 | tauri.conf.json 全字段、Cargo.toml、Builder 生命周期、dev/build 差异 |
| [03-commands](./03-commands/) | 命令系统 | invoke 调用、参数（camelCase↔snake_case）、返回值序列化、Result 错误、async |
| [04-events](./04-events/) | 事件系统 | Rust emit → 前端 listen/once、前端 emit → Rust、事件负载、去监听 |
| [05-capabilities](./05-capabilities/) | 权限与能力系统 | capabilities ACL、core:default 与精确权限、最小权限原则、allow/deny 作用域 |
| [06-plugin-fs](./06-plugin-fs/) | 插件与文件系统 | 插件体系、tauri-plugin-fs 读写、路径解析（$APPDATA）、权限作用域 |
| [07-window](./07-window/) | 窗口管理 | WebviewWindowBuilder 多窗口、动态属性调整、getByLabel 遥控 |
| [08-packaging](./08-packaging/) | 打包发布 | tauri icon 图标、bundle 配置（dmg）、tauri build 产物验证 |

## 每个单元怎么运行

每个单元目录都是完整独立的 Tauri 项目，互不依赖：

```bash
cd 01-environment
pnpm install          # 安装前端依赖
cd src-tauri && cargo fetch && cd ..
pnpm tauri dev        # 开发模式运行（首次需编译 Rust，请耐心等待）
```

> 提示：`cargo` 与 `pnpm` 都有全局缓存，后续单元的依赖不会重复占用磁盘。

## 学习进度

- [ ] 01 · 环境搭建：跑通第一个 Tauri 窗口
- [ ] 02 · 项目结构：能独立解释 tauri.conf.json 每个字段
- [ ] 03 · 命令系统：前端 ↔ Rust 的命令调用与错误处理
- [ ] 04 · 事件系统：双向事件通信与监听清理
- [ ] 05 · 权限与能力系统：亲手触发一次「权限被拒」
- [ ] 06 · 插件与文件系统：完成一次写文件→读文件闭环
- [ ] 07 · 窗口管理：创建并遥控第二个窗口
- [ ] 08 · 打包发布：产出 dmg 安装包

## 学习建议

1. **按顺序学**：概念有依赖（03/04 依赖 02 的 Builder 理解，05 依赖 03 的调用体验）；
2. **动手改配置**：如 02 改 productName、05 加权限、08 改 targets，眼见为实；
3. **善用错误**：Tauri 的错误信息（权限被拒、命令未注册）本身就是最好的教学；
4. **官方文档优先**：API 细节以 [v2.tauri.org.cn](https://v2.tauri.org.cn/) 为准。
