# 阶段 0：环境搭建与 Cargo 项目管理

本阶段的目标：**装好 Rust 工具链，跑通第一个程序，理解 Cargo 怎么管理项目**。
这是后续 7 个阶段的地基——每个 stage 都是一个独立 Cargo 项目，结构完全相同。

## 1. 安装 Rust（rustup）

Rust 官方推荐的安装方式是 `rustup`（Rust 的版本管理器，类似 `nvm` 之于 Node / `pyenv` 之于 Python）。

```bash
# macOS / Linux
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

安装过程中选默认选项（stable）即可。装完后：

```bash
# 让 rustup 加入 PATH（或直接重启终端）
source "$HOME/.cargo/env"

# 验证安装
rustc --version      # 编译器版本，如 rustc 1.8x.x
cargo --version      # 包管理器与构建工具
```

验证输出类似：

```
rustc 1.88.0 (xxxxxxxxx 2025-06-05)
cargo 1.88.0 (xxxxxxxxx 2025-06-xx)
```

> 其他平台：Windows 用户到 [rustup.rs](https://rustup.rs) 下载安装包即可。
> 升级工具链：`rustup update`。
> 如果遇到网络问题，可设置国内镜像：`export RUSTUP_DIST_SERVER=https://rsproxy.cn`。

## 2. 第一个程序：`cargo new`

本目录就是一个现成的 Cargo 项目（由 `cargo new` 生成，文件名做了教学化处理）。你也可以自己练一遍：

```bash
cargo new hello_cargo
cd hello_cargo
cargo run
```

`cargo new` 会生成：

```
hello_cargo/
├── Cargo.toml    # 项目清单：名字、版本、edition、依赖（类似 package.json / pyproject.toml）
└── src/
    └── main.rs   # 程序入口
```

## 3. Cargo 常用命令（对比 npm / pip）

| Cargo 命令 | 作用 | 对应的前端/Python 习惯 |
|-----------|------|----------------------|
| `cargo new <name>` | 创建新项目 | `npm create vite` / `uv init` |
| `cargo build` | 编译（生成 debug 产物） | `npm run build` / `pip install -e .` |
| `cargo run` | 编译并运行 | `npm run dev` / `python main.py` |
| `cargo check` | **只检查不生成**（最快，日常用） | `tsc --noEmit` / `python -m py_compile` |
| `cargo add <crate>` | 添加依赖（写进 Cargo.toml） | `npm install` / `uv add` |
| `cargo test` | 运行测试 | `npm test` / `pytest` |
| `cargo fmt` | 格式化代码（等价 rustfmt） | `prettier` |
| `cargo clippy` | 更严格的 lint | `eslint` |

## 4. Cargo.toml 逐项解读

```toml
[package]
name = "stage-0-environment"   # 项目名
version = "0.1.0"              # 版本号（遵循语义化版本）
edition = "2024"               # Rust edition：2024 是当前最新（需 rustc ≥ 1.85）

[dependencies]                 # 依赖区，本阶段为空
```

`edition = "2024"` 对应 Rust 的"语言版本"。Rust 每 3 年发布一个 edition（2015/2018/2021/2024），
用于让语言演进而不破坏旧代码。**新项目一律用最新 edition**，本课程统一 2024。

## 5. 代码解读：极简 Hello World

```rust
fn main() {
    println!("Hello, world!");
}
```

- `fn main()`：程序入口。C 里是 `int main(void)`，Python 是 `if __name__ == "__main__"`，JS 是 `main()`——每个可执行程序都必须有。
- `println!`：注意有个 `!`，表示这是**宏（macro）**而不是普通函数。宏可以接收任意数量、任意类型的参数。`{}` 是占位符，类似 C 的 `printf("%d")` 占位、Python f-string 的插值位置。

本目录的 `main.rs` 还多演示了**标准输入**的读取（等价于 Python 的 `input()`）：

```rust
use std::io;                                  // 引入标准库的 io 模块

fn main() {
    println!("Hello, world!");

    let mut input = String::new();            // let 声明变量；mut = mutable（可变）
    io::stdin()                               // 标准输入
        .read_line(&mut input)                // 读一行，存入 input
        .expect("读取输入失败");               // 出错则 panic（本阶段先不深究）
    println!("你输入了：{input}");             // 字符串插值
}
```

## 6. 运行本单元

```bash
cd stage-0-environment
cargo run
```

程序先打印 `Hello, world!`，然后等你输入一行，再原样回显。

## 常见坑

- **`cargo run` 报 `command not found`**：rustup 的 PATH 没生效，执行 `source "$HOME/.cargo/env"`。
- **`cargo new` 失败**：目录名与项目名冲突，换个名字或在空目录里执行。
- **`edition = "2024"` 报错**：rustc 版本太老，执行 `rustup update stable`。
- **编译很慢**：首次编译要链接标准库，属正常现象；之后增量编译会很快。

## 下一步

进入 `stage-1-syntax`，开始学 Rust 的基础语法：变量、类型、函数、控制流。
