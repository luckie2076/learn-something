# 阶段 8：模块（mod）与包（crate / package）

本阶段的目标：学会用 **模块** 组织一个 crate 内部的代码，用 **包管理**（Cargo）组织多个 crate 之间的依赖。
阶段 6 只给了"lib + bin"和 `cargo add` 的速览，本阶段把它完整展开——这是把项目从"几个文件"发展到"正式工程"的必修课。

```bash
cd stage-8-modules-packages
cargo run
```

> 注意：本阶段代码首次编译需要联网下载一个第三方 crate（`unicode-segmentation`），之后离线可运行。

## 0. 为什么需要模块与包？

到目前为止，你的代码都写在 `main.rs` 一个文件里。程序小没事，程序变大后会出现三个问题：

1. **文件太长**：几千行挤在一个文件里，找代码靠 Ctrl+F；
2. **名字冲突**：不同人写的 `init()`、`parse()` 撞名；
3. **依赖混乱**：用了哪些外部库、什么版本，没有统一登记。

Rust 解决这三个问题的工具，正是本阶段的三件套：

| 术语 | 是什么 | 解决什么问题 |
|---|---|---|
| **crate** | 一次编译的最小单位（一个 crate 编译出一个目标） | 代码打包成可独立复用的单元 |
| **package** | 一个 `Cargo.toml` 描述的项目，由 1 个或多个 crate 组成 | 管理"这个项目有哪些 crate" |
| **module** | crate 内部的代码分区 | 文件太长 → 拆文件；名字冲突 → 命名空间 |

**对照**：C 里"拆文件"靠 `.c` 文件 + 头文件，"复用"靠 `-l` 链接器参数，哪个符号对外可见靠手工维护头文件；Python/JS 里"拆文件"是 `import`，"装依赖"是 pip/npm。Rust 把这两件事都交给了**编译器强制检查**和 **Cargo 统一管理**——这就是 stage-6 说过的"Cargo ≈ pip/npm"。

## 1. 三个术语逐个拆

### 1.1 crate：最小编译单元

crate 有两种：

- **binary crate（二进制箱）**：有一个 `main`，编译出可执行文件。`src/main.rs` 就是 binary crate 的根。
- **library crate（库箱）**：没有 `main`，编译出 `.rlib` 库文件，给别的 crate 用。`src/lib.rs` 是它的根。

一个 crate 有一个 **根模块（crate root）**：`main.rs`（binary）或 `lib.rs`（library）。你写的所有模块，最终都要从根挂出去。

### 1.2 package：一个项目

一个 package 是**一个 `Cargo.toml`** 描述的项目。规则：

- **至少**一个 crate（否则编译什么？）；
- **至多**一个 library crate；
- 可以有**任意多个** binary crate（`src/bin/*.rs` 下每个文件一个）。

本阶段就是标准配置：**1 个 library（`src/lib.rs`）+ 1 个 binary（`src/main.rs`）**。

### 1.3 module：crate 内部的"文件夹"

模块（`mod`）相当于 crate 内部的命名空间 + 文件划分。它有两个作用：

1. **分区**：把一个大文件拆成逻辑小块（类似 C 的 `.c` 文件、Python 的 `.py` 文件）；
2. **控制可见性**：模块里默认**私有**，只有标了 `pub` 的项才能被外面看到（类似 C 的头文件里才声明、Python 里约定 `_` 开头，但 Rust 是编译器强制）。

## 2. 模块声明与可见性（mod 与 pub）

本阶段的项目里，模块是这样组织的：

```
stage-8-modules-packages/
├── Cargo.toml
└── src/
    ├── lib.rs           # 库根：声明两个模块
    ├── main.rs          # 可执行入口（binary crate 根）
    ├── geometry.rs      # 一个模块（单文件）
    ├── utils.rs         # 一个模块（还有子模块）
    └── utils/
        └── strings.rs   # utils 的子模块
```

在 `lib.rs` 里，模块通过 `mod` 声明：

```rust
pub mod geometry;   // 去 src/geometry.rs 找代码
pub mod utils;      // 去 src/utils.rs 找代码
```

`mod` 声明 + 文件路径的对应关系（**2024 edition 官方推荐风格**）：

| 声明 | 代码位置 |
|---|---|
| `mod geometry;` | `src/geometry.rs` |
| `mod utils;` | `src/utils.rs`，其子模块放 `src/utils/` 目录 |
| `mod strings;`（写在 `utils.rs` 里） | `src/utils/strings.rs` |

**核心规则：模块名 = 文件名。** `pub mod strings;` 写在 `utils.rs` 里，编译器就自动去 `utils/strings.rs` 找。这比旧式的 `mod.rs`（`utils/mod.rs`）更直观，是 2024 edition 推荐的新风格。

### 可见性：默认私有，`pub` 才公开

模块、结构体、字段、函数——**全部默认私有**，而且可见性是**一层一层**的：

```rust
// lib.rs
mod secret;      // 没写 pub：本 crate 外部根本看不到 secret 模块
pub mod geometry;
```

```rust
// geometry.rs
pub struct Circle {
    pub radius: f64,   // 字段也要 pub！否则外面能拿到 Circle 却读不了 radius
}
```

"外部能不能用 X"的判断规则就一句话：**从使用处一路到 X，中间的每一层都必须是 `pub`**。少一层就报 `private ...` 错误——这是编译器强制你遵守的"头文件纪律"，C 里漏写声明只是链接失败，Rust 直接不让你编译。

## 3. 路径：怎么找到某个项

声明好模块后，用**路径**引用其中的项。两种路径：

```rust
// 绝对路径：从 crate 根开始，用 crate 关键字
crate::geometry::Circle::new(2.0)

// 相对路径：从当前位置出发
self::geometry::Circle   // self = 当前模块
super::utils::strings    // super = 父模块（类似文件系统里的 ..）
```

类比文件系统：`crate::` 是根目录 `/`，`self::` 是当前目录 `.`，`super::` 是上级目录 `..`。`main.rs` 和 `lib.rs` 同属一个 package，但**它们各自是独立的 crate 根**，所以 `main.rs` 里不能写 `crate::geometry`（`crate` 在 main 里指 main 自己），而要写库的 crate 名：

```rust
// main.rs 里：用库的 crate 名开头（包名连字符转下划线）
stage_8_modules_packages::geometry::Circle::new(2.0)
```

> `stage-8-modules-packages` 是**包名**，它在代码里的 **crate 名**是连字符换成下划线：`stage_8_modules_packages`。包名可以有连字符，crate 名不能。

## 4. use：把长路径"搬"进作用域

完整路径太长，用 `use` 引入后就能用短名字。`main.rs` 演示了四种姿势：

```rust
// ① 不写 use：完整路径（偶尔用一次还行，多了就烦）
stage_8_modules_packages::greet("小明")

// ② use 引入：之后写 Circle 即可
use stage_8_modules_packages::geometry::Circle;
Circle::new(2.0)

// ③ as 别名：路径太长或重名时改名
use stage_8_modules_packages::utils::strings as strs;
strs::char_count("你好世界")

// ④ 花括号批量引入（还可以嵌套）
use stage_8_modules_packages::{Point, utils::strings};
```

### pub use：库设计者的"API 整形术"

前三种 `use` 是**自己用**；`pub use` 是**替别人用**——把深层的项重新导到本模块，让外部访问它的路径变短。看 `lib.rs` 末尾：

```rust
pub use geometry::{Circle, Point};            // 把 geometry 里的类型"提"到 crate 根
pub use utils::strings::{char_count, count_words};
```

效果：使用方既可以写 `stage_8_modules_packages::geometry::Circle`，也可以直接写 `stage_8_modules_packages::Circle`。**内部模块结构随便改，只要 `pub use` 的公开接口不变，使用方的代码就不用动**——这就是"对外 API 与内部实现解耦"（对应 Python 包里的 `__init__.py` 再导出、JS 的 `index.js` re-export）。

## 5. 文件组织：2024 edition 的推荐风格

旧教程里常见的 `mod.rs` 风格：

```
src/
├── lib.rs
└── utils/
    └── mod.rs        # utils 模块的代码直接写在 mod.rs 里
```

**新风格（本阶段采用，2024 edition 推荐）**：模块代码写在**和模块同名的文件**里，子模块放进同名目录：

```
src/
├── lib.rs
├── utils.rs          # utils 模块的代码在这里
└── utils/
    └── strings.rs    # utils 的子模块
```

新风格的好处：打开文件管理器，看到 `utils.rs` + `utils/` 目录，模块结构一目了然；而旧风格里 `mod.rs` 满地都是，很难分清谁是谁的模块。新项目一律用新风格。

> 对应关系：声明 `mod foo;` 时，编译器先在 `foo.rs` 找，找不到再退回 `foo/mod.rs`（旧风格兼容）。

## 6. 为什么真实项目总用 lib + bin？

本阶段（以及 stage-6）都是 `lib.rs` + `main.rs` 双文件，这不是为了教学而教学，工程上它有三个实际好处：

1. **可测试**：`main.rs` 里的代码没法被别的程序 `use`，逻辑写进 `lib.rs` 才能被单元测试和别的 crate 复用；
2. **可复用**：库和"命令行界面"分离——同一个库，今天做 CLI、明天包一层 web 服务，都只用换 `main.rs`；
3. **可读性**：强制你把"核心逻辑"和"程序入口"分开，对应 C 里"库代码 vs `main()` 所在文件"的区分，也对应 Python 里"包 vs `if __name__ == '__main__'`"。

## 7. 包管理：使用第三方 crate

模块管"内部怎么拆"，包管理管"外部用什么"。stage-6 讲过的速览，这里补全细节。

### 7.1 添加依赖

```bash
cargo add unicode-segmentation
```

`cargo add` 会做三件事：下载最新版 → 写进 `Cargo.toml` 的 `[dependencies]` → 更新 `Cargo.lock`。现在的 `Cargo.toml`：

```toml
[package]
name = "stage-8-modules-packages"
version = "0.1.0"
edition = "2024"

[dependencies]
unicode-segmentation = "1.12"   # 自动写入，版本号是"可用版本中的最新兼容版"
```

`1.12` 这种写法是 **semver（语义化版本）** 约定：`主版本.次版本.修订号`。`"1.12"` 表示"1.x 系列里兼容的最新版"（等价于 `^1.12`）。破例只在**主版本号**变化（`1.x → 2.x`）——那时 API 可能不兼容，需要你手动改代码。

### 7.2 版本锁定：Cargo.lock

`Cargo.lock` 记录**精确到修订号**的版本，保证任何人在任何时候构建，依赖都一模一样（对应 `package-lock.json` / `pip` 的 lock 文件）。需要升级依赖时用 `cargo update`。

### 7.3 生态入口：crates.io

- 所有公开 crate 都在 [crates.io](https://crates.io)（对应 npm registry / PyPI）；
- `cargo search 关键字` 命令行搜索；
- 每个 crate 的在线文档在 [docs.rs](https://docs.rs)（`cargo doc` 可在本地生成同样格式的文档）。

### 7.4 在自己的代码里使用

```rust
// src/utils/strings.rs
use unicode_segmentation::UnicodeSegmentation;

pub fn char_count(s: &str) -> usize {
    s.graphemes(true).count()   // 按"字素簇"计数：中文、emoji 都算 1 个
}
```

注意：**第三方 crate 也是 crate**，你在自己的模块里 `use` 它，用法和你 `use` 自己 crate 里的项完全一样。

## 8. 本阶段代码走读

对照 `src/` 下的文件，程序的执行顺序：

1. `main.rs` 运行，先用**完整路径**调用库根的 `greet`（①）；
2. `use` 引入 `geometry::Circle`，计算圆的面积（②）——`Circle` 定义在 `geometry.rs`，`area()` 用了 `pub radius` 字段和 `impl` 方法（阶段 3 的 `impl` 知识）；
3. `as` 别名引入 `utils::strings`，数"你好世界"的字素簇（③）——注意这里用的是**第三方 crate** `unicode-segmentation`，而不是 `s.chars().count()`（那会数错，一个中文是 1 个字素但 `char` 也是 1 个，而 `"𠮷"` 这种生僻字 1 个字素占 2 个 `char`）；
4. 通过 `lib.rs` 里的 **`pub use` 重导出**，直接拿到 `Point` 和 `count_words`（④），完全不感知内部模块结构——`char_count` 则在第 ③ 步用 `as` 别名的方式访问过。

## 常见坑

- **`mod` 声明了但文件放错位置**：报 `file not found for module`。检查路径：同级模块放 `同名.rs`，子模块放 `同名/子名.rs`。
- **忘了 `pub`**：报 `private ...`。按"从使用处到目标一路都要 `pub`"的规则逐层检查——模块、类型、字段三处最容易漏。
- **在 `main.rs` 里写 `crate::xxx` 访问库**：报错。`main.rs` 和 `lib.rs` 是两个 crate 根，`main` 里要用**库的 crate 名**（`stage_8_modules_packages::`）。
- **包名里有连字符**：代码里要写**下划线**版本。`Cargo.toml` 的 name 可以有 `-`，`use` 时的 crate 名必须是 `_`。
- **`cargo add` 报网络错误**：先确认能访问 crates.io（国内可配置镜像，见 stage-0）。
- **`cargo run` 慢**：首次要下载并编译新依赖，属正常；之后增量编译很快。

## 下一步

到这里，Rust 的核心主题（语法、所有权、类型系统、错误处理、集合、泛型、异步、模块与包）已经全部覆盖。两个自然的前进方向：

- **工程化**：为库写单元测试（`#[cfg(test)]` + `cargo test`）、用 `cargo fmt`/`clippy`、把多个包放进一个 **workspace**（Cargo 的多包管理，对应 npm monorepo / pnpm workspace）；
- **实战**：选一个 crates.io 上的真实 crate，读它的文档和源码，用你学到的模块与包知识去拆解它。

Rust 官方路线图中的下一站是 The Rust Book 的第 7 章（模块）与第 14 章（Cargo 深入），本阶段已覆盖其中 80% 的内容，可直接衔接。
