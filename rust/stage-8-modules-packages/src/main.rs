// ===== 可执行入口(src/main.rs):binary crate =====
// 这里通过 `use` 使用库(stage_8_modules_packages)公开出来的 API。
//
// 包名连字符会自动转下划线作为 crate 名:
//   stage-8-modules-packages → stage_8_modules_packages

fn main() {
    // ① 完整路径:不写 use,从 crate 根一路写到底
    println!("{}", stage_8_modules_packages::greet("小明"));

    // ② use 引入后,路径变短
    use stage_8_modules_packages::geometry::Circle;
    let c = Circle::new(2.0);
    println!("半径 2 的圆面积: {:.2}", c.area());

    // ③ as 别名:太长或重名时改名
    use stage_8_modules_packages::utils::strings as strs;
    println!("“你好世界” 的字素簇数: {}", strs::char_count("你好世界"));

    // ④ pub use 重导出:库设计者把深层模块的项"提到" crate 根,
    //    使用者不用知道内部模块结构,路径更短(见 src/lib.rs 末尾)
    use stage_8_modules_packages::{Point, count_words};
    let p = Point::new(1, 2);
    println!("点 ({}, {})", p.x, p.y);
    println!("“hello world” 单词数: {}", count_words("hello world"));
}
