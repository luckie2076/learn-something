// 引入本 crate 的库代码（crate 名 = 包名，连字符转下划线）
use stage_6_generics_traits::{area, largest, Circle, Rectangle, Shape};

fn main() {
    // 泛型函数：对 i32 和 char 都能用
    // 不能直接 largest(&vec![...])：临时值在语句结束即被释放（E0716），须先用 let 绑定
    let num_vec = vec![3, 8, 1];
    let char_vec = vec!['a', 'z', 'm'];
    let n = largest(&num_vec); // &i32
    let c = largest(&char_vec); // &char
    println!("largest: {n} {c}");

    // trait 多态（编译期）：调用 area() 时编译器就知道具体类型
    let circle = Circle { radius: 2.0 };
    let rect = Rectangle { width: 3.0, height: 4.0 };
    println!("圆形面积: {}", area(&circle));
    println!("矩形面积: {}", area(&rect));

    // 默认方法 vs 覆盖默认方法
    println!("{}", circle.description()); // Circle 用默认实现
    println!("{}", rect.description());   // Rectangle 覆盖了实现

    // 标准库 trait：Circle 实现了 Display，println! 直接可用
    println!("{circle}");

    // trait 对象（运行时多态）：不同类型放进同一个 Vec
    let shapes: Vec<&dyn Shape> = vec![&circle, &rect];
    for s in shapes {
        println!("{}", s.description());
    }

    // 外部 crate：随机数（rand 0.9 的 random() API）
    let x: u32 = rand::random();
    println!("随机数: {x}");
}
