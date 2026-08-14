# 阶段 6：泛型、trait 与包管理

本阶段的目标：理解 Rust 的抽象机制（泛型、trait），并学会用 Cargo 组织多文件项目、引入第三方库。
本单元首次采用 **lib + bin 结构**：`src/lib.rs`（库代码）+ `src/main.rs`（可执行入口）。

```bash
cd stage-6-generics-traits
cargo run
```

## 1. 泛型（Generic）：一份代码，多种类型

泛型让你写出"对任意类型都适用"的代码。C 里要做到这一点，要么用 `void *`（丢失类型安全）、要么用宏做文本替换（难调试）；Rust 在类型系统内直接支持：

```rust
// T 是类型参数：调用时自动推断为具体类型
pub fn largest<T: PartialOrd>(list: &[T]) -> &T {
    let mut largest = &list[0];
    for item in list {
        if item > largest {
            largest = item;
        }
    }
    largest
}

// 对 i32 和 char 都能用
let num_vec = vec![3, 8, 1];
let char_vec = vec!['a', 'z', 'm'];
let n = largest(&num_vec);   // &i32
let c = largest(&char_vec); // &char
```

> 小坑：不能直接写 `largest(&vec![3, 8, 1])`——`vec![]` 是临时值，语句结束即被释放，引用就悬空了（E0716）。先用 `let` 绑定让数据活得更久。这恰好复习了 stage-2 的生命周期概念。

`T: PartialOrd` 是**约束（bound）**：要求 T 支持 `>` 比较。没有约束，编译器不知道 `>` 是什么意思。
这就是"编译期多态"——同一份代码，编译器为每种类型生成对应版本（`largest<i32>`、`largest<char>` 各一份），没有运行时开销。对照 C：`void *` 方案要在运行时靠手动转换、丢失类型检查；宏方案只是文本替换。Rust 把多态交给编译器，**类型安全与性能兼得**。

泛型也可以用在结构体上：

```rust
pub struct Pair<T> {
    pub first: T,
    pub second: T,
}
```

## 2. trait：Rust 的"接口"

`trait` 定义一组行为（方法签名），各种类型可以实现它。这是 Rust 表达**抽象与多态**的核心机制。
完整的用法分四步：**定义 → 默认方法 → 实现 → 使用**。

### 2.1 定义：只声明"能做什么"

```rust
pub trait Shape {
    fn area(&self) -> f64; // 只声明方法签名，不实现
}
```

trait 只规定"做什么"，不规定"怎么做"——具体行为交给每个实现类型自己定。类比：合同只写条款，不写执行细节；Java 的 `interface`、C++ 的抽象基类也是同一思路。一个 trait 可以声明多个方法。

### 2.2 默认方法：trait 里直接给实现

除了签名，trait 还可以直接写"默认实现"——实现者**可以覆盖，也可以直接用**：

```rust
pub trait Shape {
    fn area(&self) -> f64;

    // 默认方法：基于 area() 组合出通用实现
    fn description(&self) -> String {
        format!("面积为 {:.2} 的形状", self.area())
    }
}
```

`Circle` 不覆盖就用默认的；`Rectangle` 觉得默认的不好，就自己写一份。这样"所有实现者共享一套通用逻辑，个别类型单独定制"。

### 2.3 实现：impl Shape for T

```rust
pub struct Circle { pub radius: f64 }
pub struct Rectangle { pub width: f64, pub height: f64 }

impl Shape for Circle {
    fn area(&self) -> f64 {
        std::f64::consts::PI * self.radius * self.radius
    }
    // 不写 description()：直接用默认实现
}

impl Shape for Rectangle {
    fn area(&self) -> f64 {
        self.width * self.height
    }
    // 覆盖默认实现
    fn description(&self) -> String {
        format!("矩形 {}x{}，面积 {:.2}", self.width, self.height, self.area())
    }
}
```

> **孤儿规则（orphan rule）**：`impl` 的 trait 或类型，至少有一个是本 crate 定义的。`impl Display for Circle`（自定义类型）可以；`impl MyTrait for i32`（自定义 trait）可以；但 `impl Display for String`（都来自标准库）不行——否则两个 crate 同时这么写就冲突了。

**对照 C：`trait` 相当于手写 vtable 的安全版本**。C 里模拟多态要在结构体里存函数指针：

```c
typedef struct Shape {
    double (*area)(const void *self);   // 函数指针表
} Shape;

double shape_area(const Shape *s, const void *self) { return s->area(self); }
```

`trait` + `impl Shape for T` 就是把这套"函数指针表"交给编译器生成：`impl Shape for Circle` 等价于"为 `Circle` 生成一张 `area` 函数指针表"。区别是：C 里函数指针可能没初始化、字段对不上全靠自觉；Rust 由编译器保证"实现了就能用、漏了就不编译"。（对比 Python/JS：鸭子类型是运行时检查，类型错误要运行到那行才暴露——Rust 把检查提前到编译期。）

### 2.4 使用一：作为参数（编译期多态）

```rust
// 写法一：impl Trait 语法（适合简单场景）
pub fn area(shape: &impl Shape) -> f64 {
    shape.area()
}

// 写法二：泛型 + 约束（适合复杂场景，T 可在多处复用）
pub fn area<T: Shape>(shape: &T) -> f64 {
    shape.area()
}

// 多个约束：T 必须"既是 Shape 又能格式化输出"
// 约束太长时用 where 子句更清晰
pub fn print_area<T>(shape: &T)
where
    T: Shape + std::fmt::Display,
{
    println!("{shape} 的面积是 {}", shape.area());
}
```

调用 `area(&circle)` 时，编译器在**编译期**就知道具体类型是 `Circle`，直接内联对应实现，零运行时开销——同一份代码为每个具体类型各生成一份（单态化）。

### 2.5 使用二：作为返回值

```rust
// 调用者只知道"返回了一个实现 Shape 的东西"，具体类型由函数内部决定
pub fn make_circle(radius: f64) -> impl Shape {
    Circle { radius }
}
```

> 限制：`impl Trait` 返回值**一次只能返回一种具体类型**。想让"同一个变量在运行时装不同类型"，用下一节的 trait 对象。

### 2.6 使用三：trait 对象 dyn Trait（运行时多态）

```rust
// 不同具体类型的引用，装进同一个 Vec，运行时才分发
let shapes: Vec<&dyn Shape> = vec![&circle, &rect];
for s in shapes {
    println!("{}", s.description());
}
```

`&dyn Shape` 是 **trait 对象**：运行时通过 vtable（函数指针表）跳转调用——这就是前面 C 对照里那套 vtable 的**真正的运行时版本**。

| 方式 | 分发时机 | 开销 | 典型用途 |
|------|---------|------|---------|
| 泛型 `T: Shape` | 编译期（单态化） | 零 | 通用函数、库 API |
| `dyn Shape` | 运行时（vtable 跳转） | 一次指针间接 | 异构集合、插件架构 |

### 2.7 使用四：先 use 再调用

trait 的方法只有在"trait 在作用域内"才能调用。标准库 trait 也一样，比如 `println!("{}", x)` 需要 `Display` 在作用域内（标准库的 trait 大多在 prelude 中，开箱即用；第三方 crate 的 trait 必须显式 `use` 才能调方法）。

### 2.8 到底有什么用

1. **代码复用**：把共同行为抽成一份，所有类型共享（如默认方法）。
2. **多态**：同一接口、不同实现。编译期用泛型（零开销），运行时用 `dyn Trait`。
3. **给泛型"发执照"**：泛型必须知道"这个类型能干什么"，trait 就是能力清单。第 1 节的 `largest<T: PartialOrd>` 就是典型——**没有 `PartialOrd` 约束，编译器根本不知道 `>` 是什么含义**。trait 让泛型既有约束又有能力。
4. **接入标准库/生态**：你的类型实现了 `Display` 就能 `println!`，实现了 `Iterator` 就能被 `for` 循环、被 `.map()` 处理。trait 是自定义类型与外部世界对话的"通用插口"。
5. **面向接口编程**：代码只依赖 trait，不依赖具体类型，换实现不用改调用方（依赖反转、插件化）。

### 2.9 标准库里的常见 trait

| trait | 作用 | 触发场景 |
|-------|------|---------|
| `Display` / `Debug` | 格式化输出 | `println!("{}", x)` / `println!("{:?}", x)` |
| `Clone` / `Copy` | 复制 | `.clone()`、按值赋值即拷贝 |
| `PartialEq` / `Eq` | 相等比较 | `x == y`、`HashSet` 去重 |
| `PartialOrd` / `Ord` | 大小排序 | `x > y`、`.sort()` |
| `Iterator` | 迭代器 | `for x in xs`、`.map()` / `.filter()` |
| `From` / `Into` | 类型转换 | `x.into()`、`String::from(...)` |
| `Drop` | 析构 | 离开作用域自动调用 |

```rust
// 示例：给 Circle 实现 Display（见 src/lib.rs），println! 直接可用
impl std::fmt::Display for Circle {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "Circle(r={})", self.radius)
    }
}
```

## 3. 模块化：lib + bin

> 本节是模块化的**速览**（只讲"两个文件"）；完整的模块系统——`mod`/`pub`/`use`/路径/多文件组织——见 `stage-8-modules-packages`。

一个正式项目往往分成"库"和"可执行程序"两部分：

```
stage-6-generics-traits/
├── Cargo.toml
└── src/
    ├── lib.rs    # 库：用 pub 导出可复用的代码
    └── main.rs   # 可执行程序：use 库里的代码
```

- `lib.rs` 是这个 crate 的库根，`pub fn` / `pub struct` 是对外公开的 API；
- `main.rs` 通过 `use stage_6_generics_traits::{...}` 引入（crate 名是包名下划线版：`stage-6-generics-traits` → `stage_6_generics_traits`）。

> 对照：C 里"库"是头文件 + `.c` 文件 + 链接器（`-l`），"哪些符号对外可见"靠手工维护头文件声明；Rust 的 `lib.rs` + `pub` 把这件事交给编译器，不用手工维护头文件。而 Cargo 的**依赖管理**则对应 Python 的 pip / JS 的 npm（C 无现代包管理器）；`pub` ≈ `export`。

## 4. 包管理：引入第三方 crate

阶段 0 说过 Cargo 类似 npm/pip。引入一个外部库只需两步：

```bash
# 1. 添加依赖（等价 npm install / uv add）
cargo add rand

# 2. Cargo.toml 里出现
# [dependencies]
# rand = "0.9"
```

代码里直接用：

```rust
let x: u32 = rand::random(); // 随机整数（rand 0.9 的新 API）
```

**版本管理**：`rand = "0.9"` 表示"0.9.x 系列里兼容的最新版"（semver 语义化版本）。
`Cargo.lock` 锁定精确版本，保证团队构建一致（类似 `package-lock.json`）。
`cargo update` 手动升级依赖。

> 生态入口：[crates.io](https://crates.io)（类比 npm registry）。`cargo search 关键字` 可命令行搜索。

## 常见坑

- **泛型没加约束**：报 `T: std::cmp::PartialOrd` not satisfied，补上 bound。
- **结构体字段没 `pub`**：lib 对外不可见，报 `private field`；对外字段都要 `pub`。
- **bin 里 use 不到库**：确认 lib.rs 是 `src/lib.rs`（默认库根），且函数/类型都标了 `pub`。
- **`impl Trait` 和泛型分不清**：简单参数用 `impl Trait`；需要引用同一类型多处用泛型 `<T>`。

## 下一步

进入 `stage-7-async`，学习异步编程：async/await 语法与 tokio 运行时。
