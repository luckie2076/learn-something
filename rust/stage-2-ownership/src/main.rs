// 传参 = 转移所有权
fn take(s: String) {
    println!("take 拿走: {s}");
}

// 传 & 引用 = 只借用，不拿走
fn borrow(s: &String) {
    println!("borrow 借用: {s}");
}

// &mut 可变借用：可以修改
fn change(s: &mut String) {
    s.push_str("!");
}

fn main() {
    // ===== 1. 移动：赋值转移所有权 =====
    let s1 = String::from("hello");
    let s2 = s1; // 所有权移动到 s2
    // println!("{s1}"); // 编译错误：value borrowed here after move
    println!("移动后 s2 = {s2}");

    // 标量类型实现 Copy，赋值是拷贝，旧变量仍可用
    let x = 5;
    let y = x;
    println!("Copy 类型 {x} {y} 都可用");

    // 需要都可用时，显式深拷贝
    let s3 = String::from("hello");
    let s4 = s3.clone();
    println!("clone 后 s3 = {s3}, s4 = {s4}");

    // ===== 2. 函数传参 =====
    let s5 = String::from("hi");
    take(s5); // 所有权进入函数并被释放
    // println!("{s5}"); // 编译错误：已移动

    let s6 = String::from("hi");
    borrow(&s6); // 借用，不转移
    println!("借用后 s6 = {s6}"); // 仍可用

    // ===== 3. 可变借用 &mut =====
    let mut s7 = String::from("hi");
    change(&mut s7);
    println!("可变借用后 s7 = {s7}");

    // 多个不可变引用共存 OK
    let s8 = String::from("hello");
    let r1 = &s8;
    let r2 = &s8;
    println!("两个不可变引用: {r1} {r2}");
    // let r3 = &mut s8; // 编译错误：不可变引用存在时不能可变借用

    let mut s9 = String::from("hello");
    let r4 = &mut s9;
    // let r5 = &mut s9; // 编译错误：同一作用域不能有两个可变引用
    println!("可变引用: {r4}");

    // ===== 4. 切片 =====
    let s10 = String::from("hello world");
    let hello = &s10[0..5];
    let world = &s10[6..11];
    println!("字符串切片: {hello} {world}");

    let arr = [1, 2, 3, 4, 5];
    let slice = &arr[1..3]; // [2, 3]
    println!("数组切片: {slice:?}"); // {:?} 调试格式打印
}
