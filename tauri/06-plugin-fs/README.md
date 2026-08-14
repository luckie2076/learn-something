# 单元 06 · 插件与文件系统

> Tauri 教学系列第 6 课。本单元目标：**理解插件体系，用官方 tauri-plugin-fs 读写文件，掌握路径解析与权限作用域**。
> 对应官方文档：[Tauri 2 · FS Plugin](https://v2.tauri.app/plugin/file-system/)

本单元演示「写文件 → 读文件」闭环，文件存放在应用数据目录（`$APPDATA`），并验证权限作用域的限制。

---

## 1. 什么是 Tauri 插件？

插件 = **一组打包好的 Rust 命令 + 一组配套权限**，按需安装，避免框架臃肿。

```
不用插件                       用插件
┌──────────────────┐          ┌────────────────────────────┐
│ tauri 核心框架     │   +  fs  │ tauri-plugin-fs            │
│ 命令/事件/窗口     │          │  ├─ readTextFile（命令）     │
│ (core:*)         │          │  ├─ writeTextFile（命令）    │
└──────────────────┘          │  └─ fs:allow-read-…（权限）  │
                              └────────────────────────────┘
```

**官方插件生态**（都有 `@tauri-apps/plugin-xxx` 前端包 + `tauri-plugin-xxx` Rust crate）：

| 插件 | 能力 |
| --- | --- |
| `fs` | 文件读写、目录遍历 |
| `dialog` | 原生文件/保存对话框 |
| `window` | 窗口管理（单元 07） |
| `shell` | 打开外部程序、链接 |
| `http`、`store`、`sql`… | 网络、持久化存储、数据库 |

> 模板自带的 `tauri-plugin-opener` 就是一个例子（用系统浏览器打开链接）。
> 单元 05 我们把它删掉了——「不用的插件不加，是最基础的依赖最小化」。

## 2. 安装 fs 插件（两端都要装）

Tauri 前后端分离，所以插件要装两次：

```bash
# Rust 侧：src-tauri/Cargo.toml
tauri-plugin-fs = "2"

# 前端侧：npm 包
pnpm add @tauri-apps/plugin-fs
```

Rust 侧注册插件（`src-tauri/src/lib.rs`）：

```rust
tauri::Builder::default()
    .plugin(tauri_plugin_fs::init())   // ← 注册 fs 插件
    .run(...)
```

## 3. 权限：fs 插件的最小授权

上一单元的 ACL 在此延续。fs 插件最重要的权限（带**路径作用域**）：

```jsonc
"permissions": [
  "core:default",
  {
    "identifier": "fs:allow-read-text-file",
    "allow": [{ "path": "$APPDATA/**" }]   // 只能读应用数据目录
  },
  {
    "identifier": "fs:allow-write-text-file",
    "allow": [{ "path": "$APPDATA/**" }]
  }
]
```

**路径变量**（scope 里的魔法字符串）：

| 变量 | 含义（macOS 示例） |
| --- | --- |
| `$APPDATA` | 应用数据目录（`~/Library/Application Support/<identifier>`） |
| `$HOME` | 用户主目录 |
| `$RESOURCE` | 应用资源目录 |
| `$TEMP` | 临时目录 |

- `**` 递归匹配任意子路径，`*` 只匹配一层；
- **只声明了 `$APPDATA/**`**：所以 `notes.txt`（相对 `AppData`）可以读写，
  而绝对路径如 `/etc/hosts` 会被拒绝——这就是**权限作用域**（尝试一下本单元演示的「读文件」输入绝对路径）。

## 4. 路径解析：@tauri-apps/api/path

写文件前先要知道「写哪儿」。`@tauri-apps/api/path` 提供系统路径查询：

```ts
import { appDataDir, homeDir, resolve } from "@tauri-apps/api/path";

await appDataDir();  // ~/Library/Application Support/com.example.unit06
await homeDir();     // /Users/你的用户名
await resolve(await appDataDir(), "notes.txt"); // 拼接绝对路径
```

> Tauri 2 中路径 API 属于核心包 `@tauri-apps/api/path`（不是插件），
> 它本身是只读的、无安全风险，权限在「使用路径做操作」时（fs/dialog）才需要。

## 5. 读写文件：@tauri-apps/plugin-fs

```ts
import { readTextFile, writeTextFile, BaseDirectory } from "@tauri-apps/plugin-fs";

// 写入：相对路径 + baseDir，写入 $APPDATA/notes.txt
await writeTextFile("notes.txt", "你好，Tauri", {
  baseDir: BaseDirectory.AppData,
});

// 读取：同样的定位方式
const text = await readTextFile("notes.txt", {
  baseDir: BaseDirectory.AppData,
});
```

要点：

- 相对路径必须配 `baseDir`，否则按相对当前工作目录解析（容易踩坑）；
- `BaseDirectory` 枚举与路径变量一一对应：`AppData` ↔ `$APPDATA`、`Home` ↔ `$HOME`；
- 也支持绝对路径，但**必须落在权限 scope 内**，否则被拒；
- 插件还有 `mkdir`、`remove`、`readDir`、`exists` 等 API，用法同源。

## 6. Rust 侧读写（了解即可）

前端调用已经够用，但若要在 Rust 命令里读写，用标准库即可（不受 ACL 限制，
因为 Rust 代码本身可信）：

```rust
use std::fs;

#[tauri::command]
fn save_note(path: String, content: String) -> Result<(), String> {
    fs::write(path, content).map_err(|e| e.to_string())
}
```

> 这就是安全模型的精妙处：**前端受限（ACL 管控），Rust 全权（可信代码）**。
> 敏感操作应放在 Rust 命令里，而不是给前端开放大权限。

---

## 7. 本单元小结

- [x] 理解插件 = 命令 + 权限的打包单元，按需安装
- [x] 安装并注册 `tauri-plugin-fs`（Rust + 前端两端）
- [x] 用 `$APPDATA/**` 做最小路径授权
- [x] 用 `@tauri-apps/api/path` 解析系统路径
- [x] 用 `readTextFile` / `writeTextFile` 完成读写闭环
- [x] 亲手验证权限作用域：绝对路径被拒

**下一步** → [单元 07 · 窗口管理](../07-window/)：用 WebviewWindow 创建多窗口、动态调整窗口属性。
