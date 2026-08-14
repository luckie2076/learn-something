// use std::io;

fn main() {
    // println!("Hello, world!");

    let mut arr1 = [1, 2, 3];       // [i32; 3]，栈上12字节
    let mut arr2 = arr1;            // 按位拷贝栈上全部12字节
    arr1[0] = 5;
    println!("{}", arr1[0]);

    // let mut s = String::from("hello");
    // s.push_str(", world!");
    // input = "abc";
    // println!("你输入了：{s}");
}
