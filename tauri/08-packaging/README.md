# 单元 08 · 打包发布

> Tauri 教学系列第 8 课。本单元目标：**生成应用图标、配置 bundle、跑通 `tauri build`，拿到可分发的安装包**。
> 对应官方文档：[Tauri 2 · Bundling](https://v2.tauri.org.cn/develop/bundling/)

本单元演示代码与开发版无异（这本身就是教学点：**打包不需要改代码**），重点全在配置与命令。

---

## 1. 打包原理：一条命令做三件事

```bash
pnpm tauri build
```

| 步骤 | 做什么 |
| --- | --- |
| 1. 编译前端 | 执行 `beforeBuildCommand`（`pnpm build`），产物进 `dist/` |
| 2. 编译 Rust | `cargo build --release`，产出可执行二进制 |
| 3. 打安装包 | 把二进制 + 前端静态文件 + 图标按 `bundle` 配置组装成安装包 |

产物目录：`src-tauri/target/release/bundle/`

```
bundle/
├── macos/          # .app（可直接拖进 Applications）
└── dmg/            # .dmg（分发的磁盘映像）
```

> 与 `tauri dev` 的区别：dev 用 Vite 开发服务器 + debug 编译；
> build 用静态文件 + release 编译（体积小、速度快、可分发）。

## 2. bundle 配置解析

本单元 `tauri.conf.json` 的 bundle 部分：

```jsonc
"bundle": {
  "active": true,             // 参与打包
  "targets": ["app", "dmg"],  // macOS 目标：.app 与 .dmg
  "icon": [                   // 图标（见第 3 节）
    "icons/32x32.png",
    "icons/128x128.png",
    "icons/128x128@2x.png",
    "icons/icon.icns",        // macOS 专用
    "icons/icon.ico"          // Windows 专用
  ],
  "category": "DeveloperTool" // macOS 应用分类（App Store 需要）
}
```

**targets 说明**（macOS）：

| 目标 | 产物 | 用途 |
| --- | --- | --- |
| `app` | `xxx.app` | 开发自测、拖入 Applications |
| `dmg` | `xxx.dmg` | 对外分发的磁盘映像（用户双击挂载→拖入） |
| `all` | 全部 | 模板默认值 |

> 版本号：`version` 字段会写入安装包（`0.1.0`）。升级时改这里即可。

## 3. 应用图标：`tauri icon`

图标是打包的硬性要求。脚手架生成的 `icons/` 里是 Tauri 默认图标，要换自己的：

```bash
# 准备一张 1024×1024 的 PNG（建议正方形）
pnpm tauri icon ./app-icon.png
```

`tauri icon` 会自动生成各平台所需格式：

```
icons/
├── 32x32.png / 128x128.png / 128x128@2x.png   # 通用 PNG
├── icon.icns                                    # macOS
├── icon.ico                                     # Windows
├── icon.png                                     # 各种场合
└── Square*.png / StoreLogo.png                  # 商店用
```

> 一句话：**任何平台都有 icon 用了**。生成后重启 dev 即可在窗口/任务栏看到新图标。

## 4. 验证打包产物

```bash
pnpm tauri build
# 产物示例：
#   src-tauri/target/release/bundle/macos/packaging.app
#   src-tauri/target/release/bundle/dmg/packaging_0.1.0_aarch64.dmg
```

验证清单：

- [ ] `.app` 双击能启动（`open src-tauri/target/release/bundle/macos/packaging.app`）
- [ ] 窗口标题、应用名正确（本单元演示代码会显示 `productName` 与 `version`）
- [ ] 图标显示正常（Dock 与 Finder）
- [ ] Rust 命令可用（点演示按钮，走的是 release 版后端）
- [ ] `.dmg` 挂载后拖拽安装流程正常

**体积观察**：对比一下 `.app` 的大小——通常只有十几 MB，而 Electron 同类应用动辄 100MB+。这就是 Tauri 的核心卖点。

## 5. 进阶：签名与自动更新（了解即可）

| 主题 | 说明 |
| --- | --- |
| 代码签名 | macOS 要求签名才能正常分发（`codesign`）；个人开发者用 `-- --sign` 或 CI 集成 |
| notarization | 苹果公证，发布到公网建议开启 |
| 自动更新 | 官方 `tauri-plugin-updater`：配置签名公钥 + 更新服务器，客户端静默升级 |
| 多平台 | Windows 用 `tauri build` 产 msi/nsis，Linux 产 deb/appimage |

> 完整发布流水线（CI）通常配合 GitHub Actions 官方模板，一次构建三平台。

## 6. 课程总复习

到这里，8 个单元全部学完。串起来回顾 Tauri 的应用全貌：

```
01 环境搭建 ── 脚手架与 tauri dev
02 项目结构 ── tauri.conf.json 与 Builder
03 命令系统 ── invoke：前端 → Rust（参数/返回值/错误/async）
04 事件系统 ── emit/listen：Rust ⇄ 前端主动通知
05 权限能力 ── capabilities：最小权限 ACL
06 插件与FS ── tauri-plugin-fs：读写文件 + 路径作用域
07 窗口管理 ── 多窗口与动态属性
08 打包发布 ── 图标 + dmg + 安装包
```

---

## 7. 本单元小结

- [x] 理解 `tauri build` 的三步（前端→Rust→安装包）
- [x] 配置 `bundle.targets`（app / dmg）与 `category`
- [x] 用 `tauri icon` 一键生成各平台图标
- [x] 验证产物：启动 .app、检查版本与图标
- [x] 了解签名、公证、自动更新与多平台打包

**课程完成** → 回到 [tauri 科目首页](../README.md) 查看路线图与下一步建议。
