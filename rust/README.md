# Rust 教学（基于最新稳定版 / 2024 edition）

> 面向 **C 与 Python/JS 基础都良好**的学习者，快速掌握 Rust 全貌。

## 学习假设

本课程默认你已熟练掌握：
- **C**：指针、堆栈内存模型、`malloc`/`free`、结构体、返回码式错误处理
- **Python / JS**：迭代器/列表推导、闭包、`dict`/对象、异常机制、包管理器（pip/npm）

## 对照策略

Rust 的语言世界是 **C 与高级语言各取一半**，因此本课程按内容选用最贴切的对照语言：

| 内容 | 对照语言 | 原因 |
|---|---|---|
| 基础语法、类型、数组、函数、控制流 | **C** | Rust 与 C 同属"花括号 C 系"，语法高度同源 |
| 所有权、借用、生命周期、切片 | **C**（辅以 Python/JS GC） | 本质是"无 GC 下如何管理内存"，C 的 malloc/free 模型是最佳参照 |
| 结构体、枚举（带数据）、switch/模式匹配 | **C**（enum、union、switch） | C 的 struct/enum/union/tagged-union 直接对应 |
| 错误处理（Result / `?` / panic） | **C**（返回码、errno、abort） | Result 是 C 返回码传统的类型化进化 |
| 泛型、trait（接口） | **C**（函数指针、手写 vtable） | trait 编译期多态 = C 手写 vtable 的安全化 |
| Cargo 包管理、模块化 | **Python/JS**（pip/npm、import） | C 无现代包管理器与模块体系 |
| 集合、迭代器、闭包 | **Python/JS** | 函数式特性（惰性求值、闭包捕获）C 没有直接对应 |
| 异步 async/await | **Python/JS**（辅以 C 的 pthread） | 语法模型与 Python asyncio / JS Promise 一致 |

## 路线图

| 阶段 | 目录 | 内容 | 顺带讲的原理 |
|---|---|---|---|
| 0 | `stage-0-environment` | 环境搭建、Hello World、Cargo 项目结构 | Cargo 对照 pip/npm（C 无对应物） |
| 1 | `stage-1-syntax` | 变量、标量类型、元组/数组、函数、控制流 | 与 C 语法对照（类型/数组/循环几乎同构） |
| 2 | `stage-2-ownership` | 所有权、移动、借用、切片、生命周期 | 对照 C 的 malloc/free 与悬垂指针；对比 GC |
| 3 | `stage-3-structs-enums` | 结构体、枚举、模式匹配、Option | 对照 C 的 struct/enum/tagged-union/switch |
| 4 | `stage-4-error-handling` | panic、Result、`?` 运算符、自定义错误 | 对照 C 返回码与 errno 传统 |
| 5 | `stage-5-collections` | Vec、HashMap、迭代器、闭包 | 对照 Python/JS 的函数式数据处理 |
| 6 | `stage-6-generics-traits` | 泛型、trait（附 lib+bin 与引入依赖速览） | trait 对照 C 手写 vtable；Cargo 对照 pip/npm |
| 7 | `stage-7-async` | async/await、tokio 运行时、并发 | 对照 Python asyncio；C 中只能 pthread/回调 |
| 8 | `stage-8-modules-packages` | 模块系统（mod/pub/use/路径/文件组织）、crate 与 package、Cargo 依赖管理 | 对照 Python/JS 的 import 与 pip/npm；C 的 .c+头文件+链接 |

每个 stage 都是**独立的 Cargo 项目**（各自 `Cargo.toml` + `target/`），可单独 `cargo run`，互不影响。

## 学习建议

- 按顺序从 stage-0 推进到 stage-8，每个 stage 先读 README 再跑代码。
- 运行：`cd <目录> && cargo run`（首次会编译依赖，之后秒开）。
- 所有权（stage-2）是全书最关键的一章，建议对照 C 的指针/堆栈模型反复消化，再进入后续章节。
- 模块与包（stage-8）是工程化基础：stage-6 末尾已给速览，完整展开在 stage-8，二者衔接学习效果最佳；按目录顺序放到 stage-7 之后也无妨。
