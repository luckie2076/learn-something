// 函数定义：参数必须标注类型，返回值用 -> 标注
fn add(a: i32, b: i32) -> i32 {
    a + b // 最后一个表达式即返回值（不带分号）
}

fn main() {
    // ===== 1. 变量：默认不可变 =====
    let x = 5;
    // x = 6; // 编译错误：cannot assign twice to immutable variable
    let mut y = 5; // 加 mut 才可变
    println!("y 初始 = {y}");
    y = 6;
    const MAX: u32 = 100; // const：编译期常量
    println!("x = {x}, y = {y}, MAX = {MAX}");

    // ===== 2. 标量类型 =====
    let a: i32 = -42; // 有符号整数
    let b: u64 = 42; // 无符号整数
    let c: f64 = 3.14; // 浮点数
    let ok: bool = true; // 布尔
    let ch: char = '中'; // char 是 4 字节 Unicode 标量值
    let inferred = 10; // 类型推断
    println!("{a} {b} {c} {ok} {ch} {inferred}");

    // ===== 3. 复合类型：元组与数组 =====
    let tup: (i32, f64, &str) = (500, 6.4, "元组");
    let (t0, _t1, t2) = tup; // 解构，_ 忽略该位
    let first = tup.0; // 索引访问
    println!("{t0} {t2} first = {first}");

    let arr: [i32; 3] = [1, 2, 3];
    println!("arr[0] = {}", arr[0]);

    // ===== 4. 函数调用 =====
    let sum = add(a, 8);
    println!("add 结果 = {sum}");

    // ===== 5. 控制流 =====
    let n = 7;
    if n % 2 == 0 {
        println!("n 是偶数");
    } else {
        println!("n 是奇数");
    }

    let label = if n > 5 { "大" } else { "小" }; // if 是表达式，可赋值
    println!("n 是{label}数");

    let mut count = 0;
    let loop_result = loop {
        count += 1;
        if count == 3 {
            break count * 2; // break 携带返回值
        }
    };
    println!("loop 返回 {loop_result}");

    let mut m = 3;
    while m > 0 {
        println!("倒计时 {m}");
        m -= 1;
    }

    for i in 0..3 {
        println!("for i = {i}");
    }

    // ===== 6. String 与 &str =====
    let mut s = String::from("hello");
    s.push_str(", world"); // String 可追加
    println!("{s}");

    let literal: &str = "字面量是 &str";
    println!("{literal}");
}
