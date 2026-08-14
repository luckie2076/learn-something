# 单元 04 · 事件系统

> Tauri 教学系列第 4 课。本单元目标：**掌握事件系统——Rust 与前端之间的「主动通知」**。
> 对应官方文档：[Tauri 2 · Calling the Frontend from Rust](https://v2.tauri.org.cn/develop/calling-frontend/)

本单元演示两个方向：**Rust → 前端**（下载进度推送）与 **前端 → Rust → 前端**（ping/pong 回路）。

---

## 1. 为什么要事件？invoke 不够吗？

`invoke` 是**一问一答**：前端发起，等结果。但如果 Rust 要「主动」推送数据呢？

典型场景：下载进度、日志流、后台任务状态、多窗口同步。

```
invoke（问答式）                事件（推送式）
前端 → Rust → 前端                Rust ──emit──▶ 前端
  一问一答，调用方等待             一推多收，调用方不等待
```

事件是**解耦**的：发送方不关心谁在听、有几个在听；监听方不依赖发送方存在。

## 2. 方向 1：Rust → 前端

### Rust 侧：emit

```rust
use tauri::{AppHandle, Emitter};

#[tauri::command]
async fn start_download(app: AppHandle) {
    let _ = app.emit("download-started", "开始下载…");

    for progress in [10, 30, 60, 85, 100] {
        tokio::time::sleep(Duration::from_millis(400)).await;
        let _ = app.emit("download-progress", progress);
    }

    let _ = app.emit("download-finished", "下载完成!");
}
```

- 需要 `use tauri::Emitter` trait；
- `app.emit(事件名, 负载)`：负载可以是任意可序列化值（数字、字符串、结构体）；
- 事件名用**短横线小写**（kebab-case）是社区惯例，如 `download-progress`。

### 前端侧：listen

```ts
import { listen } from "@tauri-apps/api/event";

// listen 返回 Promise<UnlistenFn>（用于取消监听）
const unlisten = await listen<number>("download-progress", (event) => {
  console.log("进度:", event.payload); // payload 是泛型 <number>
});

// 组件卸载时取消监听，避免内存泄漏
unlisten();
```

`event.payload` 就是 Rust 发出的数据；`<number>` 等泛型提供 TS 类型提示。
本单元演示中，进度条就是这么刷出来的。

## 3. once：只监听一次

若只关心「第一次发生」的事件，用 `once` 替代 `listen`：

```ts
import { once } from "@tauri-apps/api/event";

await once<string>("app-initialized", (event) => {
  console.log("首次启动完成", event.payload);
});
```

触发一次后自动移除监听器。适合「初始化完成」「首个请求到达」等语义。

## 4. 方向 2：前端 → Rust（以及完整回路）

### 前端侧：emit

```ts
import { emit } from "@tauri-apps/api/event";

emit("frontend-ping", "你好，Rust");
```

### Rust 侧：listen（在 setup 阶段注册）

```rust
use tauri::{AppHandle, Emitter, Listener};

tauri::Builder::default()
    .setup(|app| {
        let app_handle = app.handle().clone();
        app.listen("frontend-ping", move |event| {
            // event.payload() 是原始 JSON 字符串
            let _ = app_handle.emit("backend-pong", format!("Rust 收到: {}", event.payload()));
        });
        Ok(())
    })
```

- Rust 端监听需要 `use tauri::Listener` trait；
- 一般放在 `setup` 闭包里注册（应用启动时生效）；
- 完整回路 = 前端 emit → Rust listen → Rust emit → 前端 listen，本单元第 2 个卡片演示了它。

## 5. 生命周期与清理（重要）

| 对象 | 说明 |
| --- | --- |
| `listen` 返回值 | `UnlistenFn` 函数，调用即取消监听 |
| Rust `app.listen` 返回值 | 事件 ID，可 `app.unlisten(id)` |
| React 组件卸载 | 应在 `useEffect` 清理函数里调用所有 `unlisten`，否则**事件泄漏** |

本单元 App.tsx 的做法：

```ts
useEffect(() => {
  let unlisteners: UnlistenFn[] = [];
  (async () => {
    unlisteners.push(await listen(...));
    unlisteners.push(await listen(...));
  })();
  return () => unlisteners.forEach((fn) => fn());
}, []);
```

> 事件 vs 命令的选择建议：**要结果的调用用 invoke，纯通知/广播用事件**。

---

## 6. 本单元小结

- [x] 理解事件 = 推送式通信，与 invoke 的问答式互补
- [x] Rust 用 `app.emit(name, payload)` 主动推送
- [x] 前端用 `listen` / `once` 接收，`event.payload` 取数据
- [x] 前端用 `emit` 发事件，Rust 在 `setup` 里 `listen`
- [x] 会用 `unlisten` 清理监听器，避免泄漏
- [x] 看懂 ping/pong 完整回路

**下一步** → [单元 05 · 权限与能力系统](../05-capabilities/)：Tauri 2 的安全模型——capabilities 如何按最小权限开放系统能力。
