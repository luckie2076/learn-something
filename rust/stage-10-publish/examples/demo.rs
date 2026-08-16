// ===== examples/demo.rs：演示"作为库"被第三方程序调用 =====
// 运行: cargo run --example demo
// examples/ 下的每个文件都是独立的 crate，只能用公共 API（和集成测试同理）。
use strtools::{count_words, reverse, to_ascii_upper};

fn main() {
    let text = "hello rust 世界";
    println!("原文:   {text}");
    println!("单词数: {}", count_words(text));
    println!("大写:   {}", to_ascii_upper(text));
    println!("反转:   {}", reverse(text));
}
