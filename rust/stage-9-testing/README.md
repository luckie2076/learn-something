# 阶段 9：测试（单元测试 / 集成测试 / 文档测试）

本阶段的目标：掌握 Rust 的测试体系——`#[test]` 与 `cargo test`、单元测试（`#[cfg(test)] mod tests`）、集成测试（`tests/` 目录）、文档测试，以及常用命令。

```bash
cd stage-9-testing
cargo test    # 运行全部测试（单元 + 集成 + 文档）
cargo run     # 运行演示程序
```

## 0. 为什么需要测试？Rust 测试和别的语言比怎么样？

| 语言 | 测试机制 | 备注 |
|---|---|---|
| **C** | 手写 `assert()` + 一个 `main` 里挨个调用 | 没有框架，测试和代码混在一起，没人跑就没人知道坏了 |
| **Python / JS** | `pytest` / `jest`，测试文件和代码分离，`pytest` / `npm test` 一键跑 | 成熟但属于"第三方工具"，要额外安装配置 |
| **Rust** | **内置在语言里**：`#[test]` 属性 + `cargo test` | 零依赖、零配置，官方工具链自带，任何一个 crate 都能直接写测试 |

Rust 把测试做成了语言特性而非生态工具，这是它和其他语言最大的不同：

- **不需要测试框架**：`#[test]` 标记一个函数是测试，`cargo test` 自动发现并运行；
- **测试代码和发布代码分离**：`#[cfg(test)]` 保证测试代码只参与测试编译，`cargo build` 产物里完全没有它；
- **测试是"公民"**：集成测试、文档示例、依赖里的测试，`cargo test` 全部统一管理。

> 对照 C：C 程序员熟悉的"测试"就是 `assert(0)` 崩给你看。Rust 把这件事做成了完整的体系：断言还在（`assert!` 系列），但多了测试发现、测试隔离、并行运行、失败报告。

## 1. 第一个测试：`#[test]` + `cargo test`

```rust
#[test]
fn add_works() {
    assert_eq!(add(2, 3), 5);
}
```

要点：

- `#[test]` 把普通函数标记为**测试函数**；
- 测试函数返回值必须是 `()`（或 `Result<(), E>`）；
- 运行 `cargo test`，Cargo 会编译出一个**测试二进制**，自动找到所有 `#[test]` 函数并逐个运行。

运行结果大致长这样：

```
running 4 tests
test tests::add_handles_negatives ... ok
test tests::add_works             ... ok
test tests::private_fn_is_testable ... ok
test tests::divide_by_zero_panics  ... ok

test result: ok. 4 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
```

`test result` 一行是总账：通过数、失败数、忽略数、被过滤数。

## 2. 断言宏：`assert!` / `assert_eq!` / `assert_ne!`

| 宏 | 断言什么 | 失败信息 |
|---|---|---|
| `assert!(条件)` | 条件为 `true` | 只给出行号和条件，信息少 |
| `assert_eq!(a, b)` | `a == b` | **自动打印 `a` 和 `b` 的实际值**，定位快 |
| `assert_ne!(a, b)` | `a != b` | 同上 |

```rust
assert_eq!(add(2, 3), 5);        // 相等断言，失败时打印左右两边实际值
assert!(is_even(4));              // 布尔断言
assert_ne!(add(0, 0), 1);         // 不等断言
```

所有断言宏都支持追加自定义消息：`assert_eq!(a, b, "自定义提示: {a} 应该等于 {b}")`。

> 对照 C：`assert()` 只检查真假，失败打印的表达式字符串往往看不出值是多少。`assert_eq!` 的"失败打印两侧实际值"对应 pytest 的 `assert a == b` 失败信息、jest 的 `toEqual` 差异展示——这才是调试时真正有用的东西。

## 3. 单元测试：`#[cfg(test)] mod tests`

单元测试**和被测代码放在同一个文件**（如 `src/lib.rs`），惯例是文件末尾一个 `mod tests`：

```rust
#[cfg(test)]
mod tests {
    use super::*;   // 引入父模块（即被测代码所在模块）的所有名字

    #[test]
    fn add_works() {
        assert_eq!(add(2, 3), 5);
    }
}
```

三个关键点：

1. **`#[cfg(test)]` 的意思**：`cfg` = configuration，`cfg(test)` = "仅当以测试模式编译时"。普通 `cargo build` / `cargo run` 编译时，这个模块**整个被跳过**，测试代码零成本进入发布产物。对照 Python：相当于 `if __name__ == '__main__'` 后面跟着一段只在自己运行时才执行的话——Rust 用 `cfg` 把"测试时"和"发布时"在编译期就分开了。
2. **`use super::*`**：把父模块的名字引入测试作用域，这样能直接写 `add(...)` 而不用 `super::add(...)`。
3. **单元测试能测私有函数**：单元测试和被测代码编译在**同一个 crate** 里，`private fn is_even` 可以直接测。这是单元测试与集成测试最大的区别（见第 7 节）。

**测试是相互隔离的**：每个测试函数独立运行，一个测试 panic 不影响其他测试；测试之间也不共享状态。默认**多线程并行**执行（快），想串行可 `cargo test -- --test-threads=1`。

## 4. 失败时会发生什么？`--nocapture`

给 `add_handles_negatives` 故意改错（比如断言 `add(-1, -1) == 0`），`cargo test` 会：

- 打印哪个测试失败了、失败在哪一行、`assert_eq!` 的**左值和右值**各是多少；
- 其余测试照常运行（失败不中断）；
- 退出码非 0（CI 里可以用它判断构建是否通过）。

注意：**默认 `println!` 的输出会被吞掉**，只有测试失败时才一并打印出来。想强制显示输出：

```bash
cargo test -- --nocapture
```

> 对照 pytest：`-s`；jest：直接看终端。都是为了调试方便。

## 5. `#[should_panic]`：测试"应当崩溃"的场景

有些函数在非法输入时应该 panic（比如除数为 0、数组越界）。这类"应该崩"的行为也要测：

```rust
#[test]
#[should_panic(expected = "除数不能为 0")]
fn divide_by_zero_panics() {
    safe_divide(1, 0);
}
```

- `#[should_panic]` 反转预期：测试里 panic 了算**通过**，没 panic 反而算**失败**；
- `expected` 是可选参数，指定 panic 消息里应包含的子串，防止"因为别的原因崩了"也蒙混过关。

> 对照 C：等价于"这个分支应该 `abort()`"，用 `assert` 挂在函数调用之后验证。

## 6. 文档测试：文档里的代码也要跑

Rust 的文档注释里可以写示例代码，`cargo test` 会**把它们编译并运行**：

```rust
/// 返回两数之和。
///
/// # 示例
///
/// ```
/// use stage_9_testing::add;
///
/// assert_eq!(add(2, 3), 5);
/// ```
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}
```

好处：文档示例保证永远可运行，不会出现"文档里抄来的代码跑不了"的尴尬（对照 C 的手册、Python 的 docstring——那都是不验证的）。单独跑文档测试：

```bash
cargo test --doc
```

## 7. 集成测试：`tests/` 目录

集成测试放在**项目根目录的 `tests/` 文件夹**，本阶段的 `tests/integration.rs` 就是例子：

```
stage-9-testing/
├── src/
│   ├── lib.rs      # 库代码 + 单元测试
│   └── main.rs     # 程序入口
└── tests/
    └── integration.rs   # 集成测试
```

和单元测试的三大区别：

| | 单元测试（`mod tests`） | 集成测试（`tests/`） |
|---|---|---|
| 位置 | 和被测代码同一个文件 | 独立文件，**每个文件是一个独立的 crate** |
| 能看到 | 私有函数、模块内部细节 | 只能通过**公共 API**（`use stage_9_testing::...`） |
| 模拟的视角 | 开发者内部视角 | **外部使用者**的视角 |

```rust
// tests/integration.rs：模拟"外面的用户"怎么用这个库
use stage_9_testing::add;

#[test]
fn add_works_via_public_api() {
    assert_eq!(add(1, 2), 3);
}
```

> 对照 Python：`tests/` 目录对应 pytest 的 `tests/`，`import 包` 用公共接口；对照 C：集成测试对应"链接库的 .h 声明的接口"的测试，看不到 .c 里的 `static` 函数。
>
> 这就是为什么 stage-8 强调"逻辑写进 `lib.rs`"：**只有库才能被集成测试 import**，`main.rs` 里的函数外部根本碰不到。你没法给一个只有 `main.rs` 的二进制 crate 写集成测试——它没有可用的公共 API。

集成测试里如果有多个文件需要共用辅助函数，可以放 `tests/common/mod.rs`（`mod.rs` 里的代码不会被当作测试文件）。

## 8. 常用命令速查

```bash
cargo test                        # 跑全部：单元 + 集成 + 文档测试
cargo test add                    # 只跑名字包含 "add" 的测试（测试名过滤）
cargo test --test integration     # 只跑 tests/ 下的集成测试
cargo test --doc                  # 只跑文档测试
cargo test -- --nocapture         # 显示 println! 输出
cargo test -- --test-threads=1    # 单线程串行跑（默认并行）
cargo test -- --ignored           # 跑被 #[ignore] 标记的慢测试
cargo test -- --exact add_works   # 精确匹配测试名（不搞包含匹配）
```

`#[ignore]` 用于标记"平时不跑"的慢测试：`#[test] #[ignore] fn slow_test() {}`。

## 9. 本阶段代码结构回顾

```
src/lib.rs        → 逻辑 + 单元测试（mod tests） + 文档测试示例
src/main.rs       → 只调用库，不写逻辑
tests/integration.rs → 集成测试，只用公共 API
```

先 `cargo test` 看所有测试通过，再 `cargo run` 看程序效果。试着把 `lib.rs` 里某个断言改错，重新 `cargo test`，观察失败输出——能读懂失败报告，才算学会测试。

## 下一步

测试是工程化的一环。接下来可以了解：

- **`cargo fmt` / `cargo clippy`**：格式化与更严格的 lint（对应 `prettier` / `eslint`）；
- **Cargo workspace**：把多个 package 放进一个 workspace 统一管理（对应 npm monorepo）；
- 官方推荐：The Rust Book 第 11 章（测试）与第 14 章（Cargo），本阶段已覆盖其核心内容，可直接衔接。
