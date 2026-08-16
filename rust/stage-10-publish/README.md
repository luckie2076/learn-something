# 阶段 10：打包发布（一个项目 = 库 + CLI）

本阶段的目标：学会让**一个项目同时以两种身份交付**——作为**库**被第三方程序 `use`，作为**完整的 CLI** 被终端用户直接调用；并掌握从打包（`cargo package`）到发布（`cargo publish`）的完整流程。

```bash
cd stage-10-publish
cargo run -- upper "hello rust"   # 作为 CLI 使用
cargo run --example demo          # 作为库被"外部程序"调用
cargo test                        # 测试全过
```

## 0. 为什么一个项目要同时是库 + CLI？

看几个真实世界的 crate：

- **`ripgrep`（rg）**：核心搜索逻辑是 `lib.rs`，`main.rs` 只是包一层的命令行壳；
- **`serde`**：纯粹是库，没有 CLI；
- 很多工具（如 `cargo-edit`、`mdbook`）**既提供库 API，又提供命令行**。

这样设计有三个实际好处：

1. **逻辑可复用**：库 API 可以被别的程序调用，也可以被测试（stage-9 已经强调过"逻辑写进 lib 才能被测试"）；
2. **壳保持极薄**：CLI 只负责"读参数 → 调库 → 打印"，命令行格式变来变去都不动核心逻辑；
3. **一套代码，两种交付**：终端用户 `cargo install` 装 CLI，程序员 `cargo add` 引库，各取所需。

对照其他语言：

| 语言 | 库身份 | CLI 身份 |
|---|---|---|
| **Python** | `import 包`（`pyproject.toml` 声明） | `[project.scripts]` 里声明入口函数，`pip install` 后出现全局命令 |
| **JS** | `package.json` 的 `main` / `exports` 字段 | 同文件的 `bin` 字段 |
| **C** | `.a`/`.so` 静态/动态库 + 头文件 | 单独编译出的可执行文件（两者手动分发，无标准流程） |
| **Rust** | `[lib]` | `[[bin]]`，**同一个 Cargo.toml，一次 `cargo publish` 全带上** |

## 1. 项目结构

```
stage-10-publish/
├── Cargo.toml        # 一份配置，两种身份（[lib] + [[bin]]）
├── README.md
├── src/
│   ├── lib.rs        # 库：所有逻辑 + 文档注释
│   └── main.rs       # 可执行文件：极薄的 CLI 壳
└── examples/
    └── demo.rs       # 示例：演示"作为库"怎么被外部调用
```

`src/lib.rs` 和 `src/main.rs` 并存时，Cargo 自动识别为"库 + 可执行文件"的混合 crate（bin 可以直接 `use` 同 package 的 lib，无需声明依赖）。`Cargo.toml` 里的 `[lib]` / `[[bin]]` 显式配置只是为了教学清楚，按约定目录布局其实可以省略。

## 2. Cargo.toml：发布元数据

发布到 crates.io 前，`[package]` 里这些字段是**必需**的：

| 字段 | 作用 | 说明 |
|---|---|---|
| `name` | 包名 | crates.io 全局唯一，只能小写字母、数字、`-`、`_` |
| `version` | 版本号 | 遵循 **semver**（语义化版本）：`0.1.0` 中 `0.x` 表示 API 尚未稳定 |
| `description` | 一句话简介 | 会显示在 crates.io 搜索页 |
| `license` | 开源协议 | SPDX 表达式，如 `"MIT OR Apache-2.0"`（Rust 社区惯例双许可） |
| `readme` | 项目说明 | 会显示在 crates.io 的 README 区块 |

可选但推荐的字段：`keywords`（最多 5 个）、`categories`（最多 5 个，必须是 crates.io 预定义分类）、`repository`、`documentation`、`homepage`。

`include` 字段用于**精确控制打包内容**：指定后，Cargo 只打包列表里的文件，不再受 `.gitignore` 和 git 跟踪状态影响。`target/` 目录无论怎样都不会被打包。

> 对照 Python 的 `pyproject.toml`（`name`/`version`/`description`/`license`/`keywords` 几乎一一对应）；对照 JS 的 `package.json`（`name`/`version`/`description`/`license` 也是发布必需的）。

## 3. 作为 CLI：`cargo run` 与 `cargo install`

开发时直接用 `cargo run --` 传参：

```bash
cargo run -- count "hello rust world"   # 3
cargo run -- upper "hello rust"         # HELLO RUST
cargo run -- reverse "你好世界"          # 界世好你
cargo run --                            # 不带参数 → 打印用法并退出(码 1)
```

想要"安装成全局命令"（任何目录都能敲 `strtools`）：

```bash
cargo install --path .    # 编译并安装到 ~/.cargo/bin/
strtools count "a b c"    # 全局可直接使用
```

发布到 crates.io 之后，任何人都能一行安装：`cargo install strtools`——对照 `pip install <包>` 后获得全局命令（Python 的 `[project.scripts]`）、`npm i -g <包>`（JS 的 `bin` 字段）。C 语言没有等价物：分发可执行文件全靠用户手动编译。

## 4. 作为库：`examples/` 与 path 依赖

**`examples/` 目录**是官方推荐的"演示库用法"方式（每个文件是独立 crate，只能走公共 API）：

```bash
cargo run --example demo
```

**其他项目引本地库**：在对方 `Cargo.toml` 里写 path 依赖：

```toml
[dependencies]
strtools = { path = "../stage-10-publish" }
```

**引 crates.io 上的库**（发布之后）：

```toml
[dependencies]
strtools = "0.1.0"   # 只会匹配 0.1.x，不会自动升到 0.2（semver 兼容保证）
```

## 5. `cargo doc`：生成 API 文档

库的每个 `pub fn` 都写了 `///` 注释，可以直接生成 HTML 文档（对应 Python 的 Sphinx / JS 的 JSDoc，但零配置）：

```bash
cargo doc --open    # 生成到 target/doc/ 并打开浏览器
```

文档注释里的 ```` ``` ```` 代码块会被 `cargo test --doc` 当作文档测试运行（stage-9 已学）——文档永不过期。

## 6. 打包：`cargo package`

发布前先看看"将要被打包的内容"：

```bash
cargo package --list    # 列出 .crate 里会包含的文件
```

`.crate` 是一个 tar.gz 归档，包含：规范化后的 `Cargo.toml`、`src/` 源码、`examples/`、`README.md` 等（受 `include` 控制）。Cargo 会在打包前自动运行 `cargo build` 验证可编译，所以**能打包 ≠ 一定能发布，但至少保证编译通过**。

> 注意两点（在 git 仓库中打包时）：
>
> 1. **未提交的改动会拦路**：工作区有任何未提交的修改，`cargo package` 会直接报错，要求加 `--allow-dirty` 或先 `git add` + commit。这是防呆检查——保证发布内容和仓库一致。教学演练用 `cargo package --allow-dirty --list` 即可，**真实发布前请先提交**；
> 2. **没写 `include` 时**：Cargo 按 `git ls-files` 列文件，`.gitignore` 忽略的和未跟踪的文件都不会进包；写了 `include` 则完全由它决定打包内容（本单元用 `include` 明确控制）。

## 7. 发布：`cargo publish`

```bash
cargo publish --dry-run   # 本地完整演练：验证元数据、打包、编译，但不真正上传
cargo login                # 输入 crates.io 的 API token（首次）
cargo publish              # 真正发布
```

dry-run 如果提示 `warning: manifest has no documentation, homepage or repository`，只是**可选元数据**的善意提醒——真实项目建议补上 `repository`（代码仓库地址）和 `documentation`（文档地址），方便使用者溯源；不填也能发布。

发布后：

- 任何人都能 `cargo add strtools` 引库、`cargo install strtools` 装 CLI；
- **版本号不能重复**：同一个版本只能发布一次，发布后无法覆盖（对照 npm 的"版本不可变"）；
- 发布错了可以 `cargo yank --version 0.1.0`（撤回，新项目不再依赖它，已锁定的不受影响），再发 `0.1.1` 修复；
- 首次发布前先 `cargo publish --dry-run`，这是官方推荐的安全流程。

## 8. 命令速查

```bash
cargo run -- <args>           # 本地跑 CLI
cargo run --example demo      # 跑 examples/ 下的库示例
cargo install --path .        # 安装为全局命令（~/.cargo/bin）
cargo install strtools        # 从 crates.io 安装别人发布的 CLI
cargo doc --open              # 生成并打开 API 文档
cargo package --list          # 查看打包内容
cargo package                 # 生成 .crate 文件（在 target/package/）
cargo publish --dry-run       # 发布前本地演练
cargo login && cargo publish  # 首次登录后真正发布
cargo yank --version 0.1.0    # 撤回一个版本
```

## 9. 本阶段代码结构回顾

```
Cargo.toml     → [lib] + [[bin]] 双身份 + 发布元数据 + include 打包控制
src/lib.rs     → 逻辑 + 文档注释（可被 use、可被测试、可生成文档）
src/main.rs    → 极薄 CLI 壳，只调库
examples/      → 演示库的公共 API
```

先 `cargo run -- upper "hello rust"` 体验 CLI，再 `cargo run --example demo` 体验库，最后 `cargo package --list` 看看打包内容——三步走完，你就理解了"一个项目两种身份"的全貌。

## 下一步

- **Cargo workspace**：把多个 package 放进一个 workspace 统一管理（对应 npm monorepo / pnpm workspace）；
- **`cargo fmt` / `cargo clippy`**：格式化与严格 lint，发布前的质量检查（对应 `prettier` / `eslint`）；
- **CI**：在 GitHub Actions 里自动跑 `cargo test` + `cargo clippy`，tag 时自动 `cargo publish`；
- 官方文档：《Cargo 手册》的 Publishing 章节与 crates.io 文档，可衔接 The Rust Book 第 14 章。
