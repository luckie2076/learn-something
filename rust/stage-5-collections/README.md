# 阶段 5：集合与迭代器

本阶段的目标：掌握最常用的两个集合 `Vec`、`HashMap`，以及 Rust 的函数式编程风格——迭代器与闭包。

```bash
cd stage-5-collections
cargo run
```

## 1. Vec：可变长度数组

`Vec<T>` 是"动态数组"，等价于 Python 的 `list` / JS 的 `array`：

```rust
let mut v = vec![1, 2, 3]; // 宏创建，可推类型
v.push(4);                  // 追加
v.pop();                    // 弹出末尾

let first = v[0];           // 索引访问（越界会 panic）
let maybe = v.get(99);      // 安全访问 → Option<&i32>（越界返回 None，不 panic）
let len = v.len();

for x in &v {               // 遍历借用，不移动
    println!("{x}");
}
```

阶段 1 说"可变长度容器是 `Vec`"，现在就是它。它和数组 `[T; N]` 的区别：`Vec` 长度可变、数据在堆上。

> 内存模型（对照 C）：`Vec` 就是在堆上管理的一块连续缓冲区，等价于 C 里 `malloc` + `realloc` 手写的动态数组——`push` 空间不够时自动扩容（相当于 `realloc`），离开作用域自动 `free`（所有权，见阶段 2）。C 程序员手写的扩容/释放样板，Rust 封装成了类型。

## 2. HashMap：键值对

`HashMap<K, V>` 等价于 Python 的 `dict` / JS 的 `object`（但键可以是任意类型）：

```rust
use std::collections::HashMap;

let mut scores = HashMap::new();
scores.insert(String::from("蓝队"), 10);
scores.insert(String::from("红队"), 50);

let score = scores.get("蓝队");   // Option<&i32>，不存在时返回 None
for (team, s) in &scores {        // 遍历（顺序不保证）
    println!("{team}: {s}");
}
```

## 3. 迭代器：函数式数据处理

Rust 的迭代器设计非常"函数式"，和你熟悉的 `arr.map(...)` / `arr.filter(...)` 一脉相承，但更强调**链式组合**：

```rust
let nums = vec![1, 2, 3, 4, 5, 6];

// 每个算子接收一个闭包（见第 4 节，类似 JS 箭头函数）
let evens: Vec<i32> = nums.iter().filter(|&&n| n % 2 == 0).copied().collect();
let doubled: Vec<i32> = nums.iter().map(|&n| n * 2).collect();
let sum: i32 = nums.iter().sum();

// 链式：filter → map → 聚合
let result: i32 = nums.iter().filter(|&&n| n % 2 == 0).map(|&n| n * n).sum();
println!("偶数平方和: {result}"); // 2² + 4² + 6² = 56
```

| 算子 | 作用 | JS 对应 |
|------|------|---------|
| `iter()` | 产生迭代器（借用元素） | `arr[Symbol.iterator]()` |
| `.map(f)` | 每个元素变换 | `arr.map(f)` |
| `.filter(f)` | 按条件筛选 | `arr.filter(f)` |
| `.collect()` | 把迭代器收成集合 | —— |
| `.sum()` / `.fold(init, f)` | 聚合 | `reduce` |

**惰性求值（lazy）**：`nums.iter().filter(...)` 本身**不会**立刻执行——迭代器是惰性的，
直到被 `collect()` / `sum()` / `for` 消费时才真正计算。这让 Rust 可以把多个步骤合成一次遍历，性能接近手写循环。

> 对比 JS：`arr.filter(...).map(...)` 会遍历两遍；Rust 的迭代器链只遍历一遍，还不产生中间数组。

## 4. 闭包（Closure）：捕获环境的函数

闭包就是"能捕获外部变量的匿名函数"，对应 JS 的箭头函数：

```rust
let add_one = |x: i32| x + 1;   // 参数在 | | 里，没有 return，最后表达式即返回值
println!("{}", add_one(5));

let factor = 10;                 // 外部变量
let scale = |x: i32| x * factor; // 闭包捕获 factor（类似 JS 闭包）
println!("{}", scale(5));        // 50
```

与函数 `fn` 的区别：**闭包可以捕获定义它的作用域里的变量**（`factor`），而 `fn` 不能。
迭代器的 `map` / `filter` 参数就是闭包，所以你可以"把外面的状态带进数据处理逻辑"。

## 常见坑

- **`filter` 闭包参数是 `&&n`**：`iter()` 产出 `&i32`，`filter` 的闭包收到的是"引用的引用"，所以写 `|&&n|`（或 `|n| **n % 2 == 0`）。多写几次就习惯了。
- **`collect` 到 `Vec<i32>` 前先 `.copied()`**：`filter` 没有改变元素类型，产出仍是 `&i32`，直接 `collect` 会报 E0277；`copied()` 把 `&i32` 解引用成 `i32`（`map(|&n| n)` 等效，但 `copied()` 更明确）。
- **忘了 `.collect()`**：迭代器是惰性的，不 `collect` / `sum` / `for` 消费就不执行，也没有输出。
- **索引越界 panic**：不确定索引是否合法时用 `.get(i)`（返回 `Option`）而不是 `v[i]`。
- **`HashMap` 遍历顺序**：不保证与插入顺序一致（与 Python 3.7+ 的 dict 不同），需要顺序请用 `Vec` 或 `BTreeMap`。
- **循环时改了集合**：`for x in &v` 是只读借用；需要增删用 `v.retain(...)` 或先收集再处理。

## 下一步

进入 `stage-6-generics-traits`，学习 Rust 的抽象机制：泛型、trait（Rust 的"接口"），以及如何用 Cargo 引入第三方库。
