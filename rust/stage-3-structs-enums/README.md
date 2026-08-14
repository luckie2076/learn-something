# 阶段 3：结构体、枚举与模式匹配

本阶段的目标：学会用 `struct` 组织数据、用 `enum` 表达"一组可能的值"、用 `match` 优雅地分支。这些概念你都能在 C 里找到对应物——`struct`、`enum`、`union`、`switch`——但 Rust 把它们变得更安全、更强大。

```bash
cd stage-3-structs-enums
cargo run
```

## 1. 结构体（struct）：命名字段的复合类型

`struct` 与 C 的 `struct` **几乎一模一样**：自定义复合类型，命名字段，点号访问：

```rust
struct User {
    name: String,
    age: u8,
    active: bool,
}

// 实例化：所有字段必须赋值（C 里也可以留空，Rust 不允许未初始化的字段）
let u = User {
    name: String::from("小明"),
    age: 18,
    active: true,
};
println!("{}", u.name);
```

**方法（method）** 写在 `impl` 块里——这是 C 没有的：C 里操作结构体要写自由函数（`void user_greet(const User *u)`），Rust 把这类函数挂到类型上：

```rust
impl User {
    // 关联函数（相当于 C 里的"构造函数"，如 user_new）：无 self
    fn new(name: String, age: u8) -> Self {
        Self { name, age, active: true }
    }

    // 实例方法：&self 表示借用自身（对应 C 的 const User *u 参数）
    fn greet(&self) {
        println!("你好，{}（{}岁）", self.name, self.age);
    }
}

let u2 = User::new(String::from("小红"), 20); // :: 调用关联函数
u2.greet();                                    // . 调用实例方法
```

> `impl` 只是"给类型附加方法"的语法糖：`u2.greet()` 等价于 C 里的 `user_greet(&u2)`。`&self` 对应 `const User *`，`&mut self` 对应 `User *`，`self` 对应"按值传入并拥有"。

> 没有继承，怎么复用？用**组合 + trait**（阶段 6 讲 trait）。Rust 官方推崇"组合优于继承"——C 本来也没有继承，这与你已有的习惯一致。

## 2. 元组结构体：没名字段名的结构体

字段没有名字，用索引访问，适合"包装一个值"的场景：

```rust
struct Point(i32, i32);
let origin = Point(0, 0);
println!("({}, {})", origin.0, origin.1);
```

> C 里通常用 `struct Point { int x; int y; }`；Rust 的元组结构体是"只要打包、不需要名字"时的简写。

## 3. 枚举（enum）：一组"可能的值"

C 的 `enum` 只是**整型常量别名**（`enum { A, B, C }` 等价于 0, 1, 2）。Rust 的 `enum` 更强：**一个值只可能是其中一种**，且每种可以携带不同数据：

```rust
enum Direction {
    North,   // 简单变体，等价 C 的 enum { North, ... }
    South,
    East,
    West,
}

enum Message {
    Quit,                          // 无数据
    Move { x: i32, y: i32 },       // 带具名字段
    Write(String),                 // 带一个值
}
```

**带数据的枚举 = C 的"标签联合"（tagged union）**。你在 C 里可能写过：

```c
struct Message {
    int tag;              // 0 = Quit, 1 = Move, 2 = Write
    union {
        struct { int x, y; } move;
        char *write;
    } data;
};
```

C 的手写 tagged union 有两个致命问题：**tag 和 data 可能不匹配**（改了 tag 忘了改 data），以及 union 里的指针生命周期全凭自觉。Rust 把这两者**打包成一个类型**：`Message::Move { x, y }` 和 `Message::Write(s)` 由编译器保证类型安全，`s` 的释放也由所有权自动管理。

## 4. 模式匹配（match）：穷尽的分支

```rust
fn value_in_cents(coin: Coin) -> u8 {
    match coin {
        Coin::Penny => 1,
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter => 25,
    }
}
```

`match` 表面上像 C 的 `switch`，但有三点远超 `switch`：

1. **穷尽性（exhaustive）**：必须覆盖所有变体，漏一个就编译错误——C 的 `switch` 漏写 `case` 只会在运行时走 `default` 或直接漏执行，Rust 在编译期就检查"有没有漏分支"。

2. 每个分支是"模式 → 表达式"，可以**解构携带的数据**（对应 C 里手动 `switch (msg.tag) { case 1: x = msg.data.move.x; ... }` 的样板代码）：

```rust
match msg {
    Message::Quit => println!("退出"),
    Message::Move { x, y } => println!("移动到 ({x}, {y})"), // 解构字段
    Message::Write(text) => println!("写入: {text}"),        // 绑定数据
}
```

3. 兜底分支用 `_`（通配符，类似 C 的 `default:`）：

```rust
match n {
    0 => "零",
    1 => "一",
    _ => "其他",   // _ 匹配剩下的所有情况
}
```

## 5. Option：用类型消灭"空指针"问题

C 里表示"可能没有值"的惯用法是 **NULL 指针**或**哨兵值**（如返回 `-1`），而它们带来的 bug 数不胜数（空指针解引用 = 段错误）。Rust 没有 NULL，取而代之的是标准库枚举：

```rust
enum Option<T> {
    Some(T),  // 有值
    None,     // 没值
}
```

**关键**：`Option<T>` 和 `T` 是**不同类型**，不能混用。你无法对 `Option<i32>` 直接做加法——必须先处理"没值"的情况。这迫使你在编译期就把"可能没有值"的路径处理掉：

```rust
fn find(haystack: &[i32], needle: i32) -> Option<usize> {
    for (i, &v) in haystack.iter().enumerate() {
        if v == needle {
            return Some(i);
        }
    }
    None
}

match find(&nums, 20) {
    Some(i) => println!("找到了，下标 {i}"),
    None => println!("没找到"),
}
```

> 对照 C：`find` 若用 C 写，要么返回 `int`（用 `-1` 表示没找到，调用的地方容易忘检查），要么返回 `int *`（用 NULL 表示没找到，忘了判空就段错误）。Rust 的 `Option` 把"可能没有值"这个事实**写进了类型**，编译器强制你处理 `None` 分支——不是运行时才炸，而是编译不过。
> （如果你写过 Python，可理解为"类型系统强制你写 `if x is not None`"的 `Optional[T]`，但更强：漏掉 `None` 分支会编译失败。）

## 6. if let：只关心一种情况时的语法糖

当 `match` 只有一个分支有用时，用 `if let` 更简洁：

```rust
let maybe = Some(42);
if let Some(v) = maybe {
    println!("if let 拿到 {v}");
}
```

等价于"`match maybe { Some(v) => ..., _ => () }`"。

## 常见坑

- **实例化时漏了字段**：编译错误提示"missing field"。每个字段都必须赋值（C 里可以 `= {0}` 凑合，Rust 不允许）。
- **`match` 不穷尽**：报 `non-exhaustive patterns`，加上缺失分支或 `_`。
- **忘记 `.iter()`**：对数组/切片循环要用 `haystack.iter()`（阶段 5 详讲）；`for (i, &v) in ...enumerate()` 同时拿下标和值。
- **`Option<T>` 当 `T` 用**：编译报错，先 `match` / `if let` 取出里面的值（相当于 C 里忘了判 NULL 就解引用，但这是编译期报错而非段错误）。

## 下一步

进入 `stage-4-error-handling`，学习 Rust 处理"会出错的操作"的方式：`Result`、`?` 运算符与 `panic!`——这是对 C 返回码 + errno 传统的类型化升级。
