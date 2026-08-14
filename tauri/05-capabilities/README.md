# 单元 05 · 权限与能力系统

> Tauri 教学系列第 5 课。本单元目标：**理解 Tauri 2 的安全模型——capabilities 如何按最小权限开放系统能力**。
> 对应官方文档：[Tauri 2 · Capabilities](https://v2.tauri.org.cn/security/capabilities/)

本单元故意**没有**自定义命令、没有多余插件，只留最核心的 Builder——因为主角是 `capabilities/` 目录。

---

## 1. 为什么要「权限」？

你的前端是 WebView，跑在**浏览器沙箱**里。它本来什么系统能力都没有——这其实是好事：
恶意脚本只能碰 JS 的玩具世界。

但应用要干活（改窗口、读写文件…），怎么办？Tauri 2 的回答是 **ACL（Access Control List）**：

```
capabilities/default.json
        │
        │ 声明：main 窗口被允许调用这些 API
        ▼
前端调用 window.setTitle() ──▶ ACL 检查 ──▶ 允许 / 拒绝（报错）
```

**核心思想：前端默认无权限，一切系统能力显式授权。** 这称为「最小权限原则」（Principle of Least Privilege）。

> 对比 Tauri 1：旧版用 `tauri.allowlist`（写在 tauri.conf.json 里的简单开关）。
> Tauri 2 把它升级为 capabilities：支持**按窗口**、**按平台**、**带路径作用域**的精细控制。

## 2. capabilities 文件结构

默认文件：`src-tauri/capabilities/default.json`

```jsonc
{
  "$schema": "../gen/schemas/desktop-schema.json", // 编辑器提示
  "identifier": "default",                          // 能力 ID（文件唯一）
  "description": "Default capability for the main window",
  "windows": ["main"],            // 生效范围：哪个窗口（"*" = 所有窗口）
  "permissions": ["core:default"] // 授予的权限列表
}
```

| 字段 | 含义 |
| --- | --- |
| `identifier` | 能力标识，一个文件里唯一 |
| `windows` | 绑定的窗口 label（`tauri.conf.json` 中 `app.windows` 的 label，默认 `"main"`） |
| `permissions` | 权限集合，支持字符串或带作用域的对象 |
| `platforms`（可选） | 限定平台：`"macOS"` / `"windows"` / `"linux"` |

## 3. 权限的两级体系

Tauri 2 的权限分为两大类：

### 核心权限（core 系列，框架自带）

权限名格式：`core:<模块>:<操作>`

- `core:default` —— 一揽子基础权限：事件、窗口基础、应用信息、菜单、托盘等（**宽泛**）
- `core:window:allow-set-title` —— 精确到「允许设置窗口标题」
- `core:window:default` —— window 模块的一组默认权限
- `core:event:default`、`core:app:default` … 模块各自有 default 集合

**精确权限的命名规律**：`allow-` 开头的都是「允许某操作」，还有对应的 `deny-` 用于显式禁止。

### 插件权限（插件声明的权限）

每个官方插件（fs、dialog、window…）自带权限清单，格式：
`<插件名>:<权限名>`，例如 `fs:allow-read-text-file`、`dialog:open`（单元 06 用到）。

## 4. 动手实验：看权限如何「拒绝」你

本单元演示代码调用 `window.setTitle()`，而当前 `default.json` 只有 `core:default`：

```ts
await getCurrentWindow().setTitle("新标题");
```

**预期结果：调用被拒绝**，报错类似 `window.setTitle not allowed`。
这正是 ACL 在起作用——没有授权，前端连改窗口标题都做不到。

然后按页面提示，把权限加进 `default.json`：

```jsonc
"permissions": [
  "core:default",
  "core:window:allow-set-title"
]
```

重启 `pnpm tauri dev`，再点按钮：成功，标题变了。

> 教学点：**先失败、再授权、后成功**——亲眼看到权限开关的效果，比背文档深刻得多。

## 5. 自定义权限与作用域（进阶）

权限不只是字符串，还能带 **allow / deny 作用域**，精确到「哪个路径」「哪些值」：

```jsonc
{
  "identifier": "user-files",
  "windows": ["main"],
  "permissions": [
    "core:default",
    "fs:allow-read-text-file",          // 允许读文本文件…
    {
      "identifier": "fs:allow-write-text-file",
      "allow": [{ "path": "$HOME/notes/**" }]  // …但只能写 notes 目录下
    }
  ]
}
```

- `allow` 数组定义「白名单」，`deny` 定义「黑名单」，黑名单优先；
- `$HOME`、`$APPDATA`、`$RESOURCE` 等是路径变量（单元 06 详解）；
- 这种「功能可用但范围受限」的模型，让前端被攻破时的危害降到最低。

## 6. 常见安全建议

1. **不要无脑 `"*"`**：`windows: ["*"]` 会让所有窗口共享全部权限；
2. **从最小集开始**：先只加够用的权限，报错了再加（本单元的实验方式）；
3. **作用域越窄越好**：写文件限定目录，比全局放行安全得多；
4. **生产环境配置 CSP**：`tauri.conf.json` 的 `app.security.csp` 不要长期为 `null`。

---

## 7. 本单元小结

- [x] 理解 ACL 模型：前端默认无权限，capabilities 显式授权
- [x] 看懂 `capabilities/default.json` 各字段（identifier/windows/permissions）
- [x] 区分 `core:default` 宽泛权限与 `core:window:allow-set-title` 精确权限
- [x] 亲手触发一次「权限被拒」，再授权成功
- [x] 了解自定义权限的 allow/deny 作用域写法

**下一步** → [单元 06 · 插件与文件系统](../06-plugin-fs/)：引入第一个官方插件 tauri-plugin-fs，读写文件并解析路径变量。
