use std::collections::HashMap;

fn main() {
    // ===== 1. Vec：可变长度数组 =====
    let mut v = vec![1, 2, 3];
    v.push(4);
    println!("v = {v:?}, len = {}", v.len());

    let first = v[0]; // 索引访问（越界会 panic）
    let maybe = v.get(99); // 安全访问 → Option（越界返回 None）
    println!("v[0] = {first}, v.get(99) = {maybe:?}");

    for x in &v {
        println!("元素 {x}");
    }

    // ===== 2. HashMap：键值对 =====
    let mut scores = HashMap::new();
    scores.insert(String::from("蓝队"), 10);
    scores.insert(String::from("红队"), 50);
    println!("蓝队得分 = {:?}", scores.get("蓝队"));

    for (team, s) in &scores {
        println!("{team}: {s}");
    }

    // ===== 3. 迭代器：函数式数据处理 =====
    let nums = vec![1, 2, 3, 4, 5, 6];
    let evens: Vec<i32> = nums.iter().filter(|&&n| n % 2 == 0).copied().collect();
    let doubled: Vec<i32> = nums.iter().map(|&n| n * 2).collect();
    let sum: i32 = nums.iter().sum();
    println!("偶数: {evens:?}");
    println!("翻倍: {doubled:?}");
    println!("总和: {sum}");

    // 链式组合：filter → map → 聚合（只遍历一遍）
    let even_squares: i32 = nums.iter().filter(|&&n| n % 2 == 0).map(|&n| n * n).sum();
    println!("偶数平方和: {even_squares}"); // 4 + 16 + 36 = 56

    // fold：更通用的聚合
    let product: i32 = nums.iter().fold(1, |acc, &n| acc * n);
    println!("累乘: {product}");

    // ===== 4. 闭包：捕获外部变量 =====
    let add_one = |x: i32| x + 1;
    println!("add_one(5) = {}", add_one(5));

    let factor = 10;
    let scale = |x: i32| x * factor; // 闭包捕获 factor
    println!("scale(5) = {}", scale(5));
}
