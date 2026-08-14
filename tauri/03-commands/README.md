# 单元 03 · 命令系统

> Tauri 教学系列第 3 课。本单元目标：**掌握 `invoke`——前端调用 Rust 的完整契约：参数、返回值、错误、async**。
> 对应官方文档：[Tauri 2 · Calling Rust from the Frontend](https://v2.tauri.org.cn/develop/calling-rust/)

本目录在前端演示了 4 种命令形态，对应 `src-tauri/src/lib.rs` 里的 4 个 `#[tauri::command]`。

---

## 1. 概念：什么是「命令」（command）

前端（WebView）运行在浏览器沙箱里，**无法直接访问系统**；Rust 拥有全部系统权限。
「命令」就是 Tauri 定义的一座桥：

```
前端 JS                          Rust
invoke("divide", ── IPC ──▶  #[tauri::command] fn divide(...)
  { a, b })         ◀────      Ok(5.0) 或 Err("除数不能为零")
```

命令用 `#[tauri::command]` 标记，在 `run()` 里用 `generate_handler!` 注册，
前端就能用 `invoke("函数名", { 参数 })` 调用它。

## 2. 基础形态：同步命令

```rust
#[tauri::command]
fn greet(name: &str) -> String {
    format!("你好，{name}！")
}
```

```ts
import { invoke } from "@tauri-apps/api/core";

const msg: string = await invoke("greet", { name: "Tauri" });
```

注意：`invoke` 始终返回 **Promise**，所以用 `await`。参数对象里也可以传数字、布尔、数组、嵌套对象。

## 3. 参数命名：camelCase 与 snake_case 的坑

Rust 社区习惯 `snake_case`，JS 习惯 `camelCase`。Tauri 的默认约定是：

> 前端传 **camelCase**（`myArg`），Rust 接收 **snake_case**（`my_arg`）。

```rust
#[tauri::command]
fn add(first_number: i32, second_number: i32) -> i32 { ... }

// 前端：invoke("add", { firstNumber: 1, secondNumber: 2 })
```

若想让前端也写 snake_case，可以显式声明：

```rust
#[tauri::command(rename_all = "snake_case")]
fn add(first_number: i32, second_number: i32) -> i32 { ... }

// 前端：invoke("add", { first_number: 1, second_number: 2 })
```

> 本单元演示代码刻意使用单单词参数（`a`、`b`、`ms`）避免干扰教学；
> 实际项目里这是最常见的错误来源，请务必记住默认是 camelCase。

## 4. 返回值与序列化（serde）

Rust 的返回值通过 **serde** 序列化成 JSON 传给前端。三种典型：

| Rust 返回类型 | 前端收到 |
| --- | --- |
| `String` / `i32` / `f64` / `bool` | 对应 JS 原始值 |
| `Vec<T>` | 数组 |
| 自定义 `struct`（derive `Serialize`） | 普通 JS 对象 |

```rust
#[derive(Serialize)]
struct OsInfo {
    os: &'static str,
    arch: &'static str,
    cpu_cores: usize,
}
```

前端直接拿到 `{ os: "macos", arch: "aarch64", cpu_cores: 8 }` 这样的对象。
字段名默认保持 Rust 原名（snake_case），需要 camelCase 可加 `#[serde(rename_all = "camelCase")]`。

## 5. 错误处理：`Result<T, E>`

命令返回 `Result` 时，Tauri 自动映射为 Promise 的成败：

```rust
#[tauri::command]
fn divide(a: f64, b: f64) -> Result<f64, String> {
    if b == 0.0 {
        Err("除数不能为零".to_string())   // 前端走 catch
    } else {
        Ok(a / b)                          // 前端走 then
    }
}
```

```ts
try {
  const r = await invoke("divide", { a: 10, b: 0 });
} catch (e) {
  console.error(e); // "除数不能为零"
}
```

错误类型通常是 `String`；复杂项目可定义自己的错误枚举并实现 `serde::Serialize`。

## 6. async 命令：不阻塞的耗时操作

默认 `#[tauri::command]` 是同步的，若做耗时操作（读大文件、发请求）会**阻塞其他命令**。
解决办法：声明 `async fn`，Tauri 会将其调度到异步运行时：

```rust
#[tauri::command]
async fn slow_ping(ms: u64) -> Result<String, String> {
    if ms > 5000 { return Err("太长".into()); }
    tokio::time::sleep(Duration::from_millis(ms)).await;
    Ok(format!("等待 {ms} 毫秒"))
}
```

> **必须返回 `Result`**（官方约定，异步错误才有地方可去）；耗时逻辑放在
> `.await` 之后，阻塞型 CPU 密集任务建议用 `tauri::async_runtime::spawn_blocking`。
> 本单元在 `Cargo.toml` 引入了 `tokio`（仅 `time` feature）用于演示 sleep。

## 7. 注册命令：`generate_handler!`

所有命令必须登记到 Builder 上才能被调用：

```rust
.invoke_handler(tauri::generate_handler![
    greet,
    divide,
    get_os_info,
    slow_ping
])
```

漏掉注册会报 `invoke: 命令名 not found`。这是新手常见错误。

---

## 8. 本单元小结

- [x] 理解命令 = 前端调用 Rust 的 IPC 通道
- [x] 掌握 `invoke` 的 Promise 用法与参数对象
- [x] 记住参数 camelCase ↔ snake_case 的默认转换
- [x] 会用 serde 序列化复杂返回值（对象/数组）
- [x] 用 `Result<T, E>` 承载错误，前端 try/catch 接收
- [x] 用 async 命令处理耗时任务
- [x] 命令注册在 `generate_handler!`

**下一步** → [单元 04 · 事件系统](../04-events/)：反向通信——Rust 主动推数据给前端（emit / listen），以及前端向 Rust 发事件。
