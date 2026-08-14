# 单元 07 · 窗口管理

> Tauri 教学系列第 7 课。本单元目标：**创建多窗口，动态调整窗口属性，用 label 遥控其他窗口**。
> 对应官方文档：[Tauri 2 · Window](https://v2.tauri.org.cn/learn/window/)

本单元演示三条主线：Rust 创建第二窗口 → 前端动态调整当前窗口 → `getByLabel` 遥控其他窗口。

---

## 1. 窗口模型：label 是身份证

Tauri 里每个窗口都有一个 **label**（唯一字符串标识），配置在 `tauri.conf.json`：

```json
"app": {
  "windows": [
    { "title": "主窗口", "label": "main", "width": 800, "height": 600 }
  ]
}
```

- 默认第一个窗口 label 是 `main`（省略 `label` 字段时）；
- 所有窗口 API（Rust 的 `get_webview_window`、前端的 `WebviewWindow.getByLabel`）都用 label 定位窗口；
- **capabilities 的 `windows` 数组也按 label 匹配**（单元 05 讲过）——权限可以精确到「哪个窗口」！

## 2. 创建窗口：三种方式

### 方式 A：配置文件声明（静态）

`tauri.conf.json` 的 `app.windows` 数组，启动即建。上面已见。

### 方式 B：Rust 命令创建（动态，本单元演示）

```rust
use tauri::{Manager, WebviewUrl, WebviewWindowBuilder};

#[tauri::command]
fn create_second_window(app: tauri::AppHandle) -> Result<(), String> {
    WebviewWindowBuilder::new(&app, "second", WebviewUrl::App("index.html".into()))
        .title("第二个窗口")
        .inner_size(480.0, 360.0)
        .build()
        .map_err(|e| e.to_string())?;
    Ok(())
}
```

- `WebviewUrl::App("index.html")` 指定窗口加载哪个前端页面（也支持远程 URL）；
- builder 模式可链式设置标题、尺寸、是否可缩放等；
- **Rust 侧创建窗口不需要前端权限**（Rust 是可信代码）。

### 方式 C：前端创建

```ts
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";

await WebviewWindow.getByLabel("second");            // 查询现有窗口
const win = new WebviewWindow("second", { title: "第二个窗口" });
```

前端创建需要额外权限 `core:webview:allow-create-webview-window`——
本单元故意用 Rust 方式，展示「权限可省则省」的取舍。

## 3. 动态调整窗口属性（前端）

`getCurrentWindow()` 拿到当前窗口实例后，可调用一系列异步方法：

```ts
import { getCurrentWindow } from "@tauri-apps/api/window";
import { LogicalSize, LogicalPosition } from "@tauri-apps/api/dpi";

const win = getCurrentWindow();

await win.setTitle("新标题");                  // 标题
await win.setSize(new LogicalSize(600, 400));  // 尺寸
await win.setPosition(new LogicalPosition(100, 100)); // 位置
await win.setFullscreen(true);                 // 全屏
await win.minimize();                          // 最小化
await win.unminimize();                        // 恢复
await win.maximize();                          // 最大化
await win.unmaximize();                        // 还原
```

**Logical vs Physical**：`LogicalSize` 是「逻辑像素」（与屏幕缩放无关），
`PhysicalSize` 是物理像素。日常用 Logical 即可，不同缩放率的显示器表现一致。

> 每个操作都对应一条权限（`core:window:allow-set-title`、`allow-set-size`…），
> 本单元的 capabilities 按需精确声明——这就是单元 05 的 ACL 在实际应用中的样子。

## 4. 遥控其他窗口：getByLabel

```ts
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";

const second = await WebviewWindow.getByLabel("second");
if (second) {
  await second.setTitle("被遥控的标题");
  await second.close();   // 关闭窗口
}
```

- `getByLabel` 返回 `WebviewWindow | null`——label 不存在时返回 null，务必判空；
- 拿到实例后，能做的操作与 `getCurrentWindow()` 完全一致；
- Rust 侧对应 `app.get_webview_window("second")`（需要 `use tauri::Manager`）。

## 5. 窗口与安全

| 能力 | 权限 | 说明 |
| --- | --- | --- |
| 改标题 | `core:window:allow-set-title` | |
| 改尺寸 | `core:window:allow-set-size` | |
| 移动 | `core:window:allow-set-position` | |
| 全屏 | `core:window:allow-set-fullscreen` | |
| 最小/最大 | `core:window:allow-minimize` / `allow-maximize` | 还有对应的 un- |
| 前端建窗 | `core:webview:allow-create-webview-window` | 本单元未开 |

**最小权限实践**：给 `windows: ["main"]` 的能力里开 main 需要的权限；
如果 second 窗口需要不同权限，就再写一个 capability 文件绑定 `windows: ["second"]`。

---

## 6. 本单元小结

- [x] 理解窗口 label = 窗口身份证（配置/API/权限都靠它）
- [x] 用 `WebviewWindowBuilder`（Rust）创建第二窗口
- [x] 用 `getCurrentWindow()` 动态调整标题/尺寸/位置/全屏/最小化/最大化
- [x] 区分 Logical 与 Physical 尺寸
- [x] 用 `getByLabel` 查询并遥控其他窗口
- [x] 知道每种窗口操作的对应权限

**下一步** → [单元 08 · 打包发布](../08-packaging/)：生成应用图标、配置 dmg 打包，产出可分发安装包。
