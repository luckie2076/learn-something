# 阶段 4：错误处理

本阶段的目标：掌握 Rust 处理错误的两大机制——`panic!`（不可恢复）与 `Result`（可恢复），以及 `?` 运算符。

```bash
cd stage-4-error-handling
cargo run
```

## 0. Rust 的错误处理哲学

Rust 把错误分成两类，**编译器强制你区分**：

| 类别 | 机制 | 含义 | 与 C 的对比 |
|------|------|------|-------------|
| 不可恢复 | `panic!` | 程序直接崩溃退出 | C 的 `abort()` / `assert()` |
| 可恢复 | `Result<T, E>` | 返回一个"结果"，由调用者决定怎么处理 | C 的返回码 + `errno` 传统 |

**C 程序员其实早就熟悉了可恢复错误的思路**：POSIX 函数返回 `-1` + 全局 `errno`，`fopen` 失败返回 `NULL`。Rust 的 `Result` 是对这套传统做**类型化升级**：

- C 里错误靠**约定**（查手册才知道返回值啥意思），Rust 把错误编码进**类型**：`Result<T, E>` 明确告诉你"可能失败"。
- C 里忘检查返回值是**运行时**的静默错误（继续用 NULL 指针），Rust 里漏处理 `Err` 直接**编译不过**。
- C 的 `errno` 是全局状态（线程不安全、容易覆盖），Rust 的错误是**随返回值走的局部值**。

（如果你写过 Python/JS：`Result` 是"返回值"而非"抛出的异常"——异常不 `catch` 没人拦你，Rust 强制你显式处理每一条失败路径。）

## 1. panic!：程序直接崩溃

```rust
panic!("出错了"); // 打印消息、展开调用栈，然后退出
```

什么场景会触发？
- 显式调用 `panic!`（等价 C 的 `assert(0)` / `abort()`）；
- 代码里未处理的越界访问（`v[99]`，等价 C 的数组越界——但 C 是未定义行为，Rust 是确定的 panic）。

panic 适合"**编程错误**"：代码逻辑上不该发生的情况。比如配置缺失、不变量被破坏。

## 2. Result<T, E>：可恢复错误

```rust
use std::fs::File;

let result = File::open("hello.txt"); // 类型是 Result<File, io::Error>
```

打开文件可能失败（文件不存在），Rust 不抛异常，而是返回 `Result`——就像 C 里 `fopen` 失败返回 `NULL`。处理方式有几种，从"最啰嗦"到"最常用"：

**方式一：`match` 全量处理**

```rust
match result {
    Ok(file) => println!("打开成功: {file:?}"),
    Err(e) => println!("打开失败: {e}"),
}
```

**方式二：`unwrap()` / `expect()`——快速取值，失败就 panic**

```rust
let file = result.unwrap();                    // 失败 → panic
let file = result.expect("文件必须存在");        // 失败 → 用自定义消息 panic
```

> 对照 C：等价于"拿到 NULL 就 `assert` 崩掉"。开发早期可以用 `expect` 快速打通流程，但生产代码一般要优雅处理错误。**不要到处 unwrap**。

**方式三：`?` 运算符——错误自动向上传播（最常用）**

```rust
fn read_username(path: &str) -> Result<String, io::Error> {
    let mut file = File::open(path)?;   // 失败？直接 return Err，不用写 match
    let mut s = String::new();
    file.read_to_string(&mut s)?;
    Ok(s)                               // 成功则打包成 Ok 返回
}
```

你在 C 里一定写过这种样板：

```c
int read_username(const char *path, char *buf, size_t len) {
    FILE *f = fopen(path, "r");
    if (f == NULL) return -1;          // 错误检查 #1
    if (fgets(buf, len, f) == NULL) {  // 错误检查 #2
        fclose(f);
        return -1;
    }
    fclose(f);
    return 0;
}
```

`?` 就是把这套 `if (失败) return -1;` 样板浓缩成一个运算符：

```rust
match File::open(path) {
    Ok(f) => f,          // 成功，把值取出来继续
    Err(e) => return Err(e.into()),  // 失败，当前函数直接返回错误
}
```

`?` **只能在返回 `Result`（或 `Option`）的函数里用**——因为失败时它需要 `return` 一个错误。
这就是为什么 `main` 也可以写成 `fn main() -> Result<(), Box<dyn std::error::Error>>`（对应 C 的 `return EXIT_FAILURE`，但带上了错误信息）。

## 3. 自定义错误类型

正式项目里一般定义自己的错误类型——对应 C 里为 errno 定义枚举（`EACCES`、`ENOENT`…）。极简做法：定义一个结构体实现 `Display` 和 `Error`：

```rust
use std::fmt;

#[derive(Debug)]
struct AgeError;                      // 错误类型本身

impl fmt::Display for AgeError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "年龄必须大于 0")
    }
}

impl std::error::Error for AgeError {} // 标记为标准错误类型

fn check_age(age: i32) -> Result<u32, AgeError> {
    if age > 0 {
        Ok(age as u32)
    } else {
        Err(AgeError)
    }
}
```

> 与 C 的差异：C 的错误码是"裸整数"（`-1`、`EACCES`），谁都能混淆；Rust 的错误是**有类型的值**，`Err(io::Error)` 和 `Err(MyError)` 无法混淆，且可以带数据（文件名、上下文）。生产环境通常用 `thiserror` / `anyhow` 这两个 crate 简化错误定义与传播，入门阶段先理解机制即可。

## 常见坑

- **`?` 用在不返回 Result 的函数里**：编译报错，把函数签名改成返回 `Result<_, _>`，或改用 `match` 处理。
- **错误类型不匹配**：函数返回 `Result<String, io::Error>` 但 `?` 传播的是别的错误——用 `Box<dyn Error>` 或 `.map_err()` 转换。
- **到处 `unwrap()`**：`expect("有意义的消息")` 至少能让 panic 信息可读；能传播错误的场景优先 `?`。
- **`main` 里想用 `?`**：把 `main` 签名改为 `fn main() -> Result<(), Box<dyn std::error::Error>>`。

## 下一步

进入 `stage-5-collections`，学习最常用的集合 `Vec`、`HashMap`，以及 Rust 的函数式利器：迭代器与闭包——这部分与 Python/JS 的函数式特性对照更贴切。
