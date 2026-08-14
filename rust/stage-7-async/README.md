# 阶段 7：异步编程（async/await + tokio）

本阶段的目标：掌握 Rust 的异步模型。涉及网络请求、并发执行等场景时你会频繁用到它。

```bash
cd stage-7-async
cargo run
```

## 0. 为什么需要异步？

程序经常要等"外部世界"：读文件、发网络请求、查数据库。等待时 CPU 是空闲的。

| 方案 | 做法 | 问题 |
|------|------|------|
| 同步（阻塞） | 等一个请求完成再发下一个 | 串行等待，浪费大量时间 |
| 多线程 | 每请求一个线程 | 线程开销大（每线程几 MB 栈），上下文切换贵 |
| **异步** | **等待时不占线程**，线程转去干别的活 | 需要运行时调度（tokio） |

异步的本质：**单线程也能并发**。一个线程发出 100 个请求后不干等，而是处理已完成的部分——类似 JS 的事件循环 / Python 的 asyncio。

> 对照 C：C 里没有 async/await。要做高并发 I/O，只有三条老路：pthread 每请求一线程（开销大）、`select`/`epoll` 手写事件循环（样板代码多、易错）、回调函数（"回调地狱"）。Rust 的 async/await 相当于把 `epoll` 事件循环 + 回调都封装成了语言级语法，写起来像同步代码，跑起来却是事件驱动。

## 1. async / await 语法

```rust
// async fn：定义异步函数，调用后返回一个 Future（"未来的结果"）
async fn fetch_data(name: &str) -> String {
    println!("{name}: 开始请求...");
    tokio::time::sleep(Duration::from_millis(300)).await; // 模拟网络等待
    format!("{name} 的数据")
}
```

三个关键概念：

- **`async fn`**：声明一个异步函数。它**不会立即执行**，调用它返回的是一个 `Future`。
- **`Future`**：一个"尚未完成的计算"（类似 JS 的 Promise）。创建它不做任何事，只有 `.await` 才真正执行。
- **`.await`**：等待一个 Future 完成。等待期间**不阻塞线程**——线程被让出去执行其他任务。

> 对比：JS 的 `async` 函数返回 Promise，用 `await` 等待；Python 的 `async def` 返回 coroutine，用 `await` 等待。Rust 的模型完全一致，区别是 Rust 的 Future 默认不分配内存、性能更高，但需要**运行时（runtime）**来驱动。

## 2. tokio：异步运行时

Rust 标准库只提供 async/await 语法，**谁来驱动这些 Future 执行**需要一个运行时。生态标准是 **tokio**（相当于 Node 的事件循环 + 线程池）。

```toml
[dependencies]
tokio = { version = "1", features = ["full"] }  # full = 启用全部功能（最省心）
```

入口写法：`main` 必须是 async 的，用 `#[tokio::main]` 宏自动启动运行时：

```rust
#[tokio::main]
async fn main() {
    // 这里是异步世界
}
```

## 3. 串行 vs 并发

```rust
// 串行：await 一个完成再开始下一个（总耗时 600ms）
let a = fetch_data("请求A").await;
let b = fetch_data("请求B").await;

// 并发：两个 Future 同时推进（总耗时 ~300ms）
let handle1 = tokio::spawn(fetch_data("并发1")); // spawn：丢进运行时独立执行
let handle2 = tokio::spawn(fetch_data("并发2"));
let r1 = handle1.await.expect("任务1失败");
let r2 = handle2.await.expect("任务2失败");
```

`tokio::spawn` 是并发的关键：它把一个 Future 交给运行时**并行调度**，返回一个 `JoinHandle`，
`handle.await` 取回结果。跑一遍本单元代码，观察打印顺序和耗时差异，就直观理解了异步的价值。

## 4. 异步 vs 多线程

| | 异步（tokio） | 多线程（std::thread） |
|---|---|---|
| 并发方式 | 单/多线程上"协作式"切换 | 操作系统抢占式调度 |
| 适合 | 大量 I/O 等待（网络、文件、DB） | CPU 密集计算、真正并行 |
| 开销 | 极低（一个任务几 KB） | 每线程几 MB 栈 |
| 心智 | 一个任务一个 `async fn` | 共享状态需要锁（Rust 靠所有权 + 类型系统保障） |

实际项目常**两者结合**：tokio 负责 I/O 并发，`spawn_blocking` 把 CPU 密集活丢给线程池。

> C 视角：C 的 pthread 就是上表的"多线程"列——每线程几 MB 栈、加锁靠自觉，且 Rust 里 `std::thread` 因所有权 + 类型系统在编译期就挡住了数据竞争（C 里只能靠 valgrind 事后查）。异步表里的"等待时不占线程"在 C 里对应 epoll 事件循环，tokio 内部正是这么实现的。

## 常见坑

- **`main` 是 async 但没加 `#[tokio::main]`**：报 `future cannot be sent between threads safely` 或运行不起来。记住入口固定写法。
- **`sleep` 用了 `std::thread::sleep`**：那是阻塞的，会卡住整个异步任务；异步里用 `tokio::time::sleep`。
- **忘写 `.await`**：拿到的是 Future 而不是值，类型对不上——编译器会提示。
- **忘了 `features = ["full"]`**：`tokio::spawn`、`tokio::time` 等需要对应 feature，`full` 一键全开。

## 结课：下一步怎么走

恭喜，你已经走完 Rust 入门 8 个单元。接下来可以：

1. **做小项目练手**：命令行工具（`clap`）、HTTP 服务（`axum` + tokio）、解析 JSON（`serde`）。
2. **读官方资料**：[The Rust Book](https://doc.rust-lang.org/book/)（完整教材）、[Async Book](https://rust-lang.github.io/async-book/)（异步深入）。
3. **看生态**：[crates.io](https://crates.io) 逛逛常用库；[Rust by Example](https://doc.rust-lang.org/rust-by-example/) 刷示例。
4. **实践建议**：把某个熟悉的小工具（如 Python 脚本）用 Rust 重写一遍，是巩固所有权/错误处理/迭代器的最好方式。

祝学习愉快。Rust 最陡峭的部分（所有权）你已经爬过来了，剩下的都是积累。
