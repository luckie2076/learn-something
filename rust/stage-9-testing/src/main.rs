// main.rs：程序入口，只负责"调用库"演示效果，不写任何逻辑（逻辑在 lib.rs，才能被测试）。
use stage_9_testing::{add, safe_divide};

fn main() {
    println!("add(2, 3) = {}", add(2, 3));
    println!("safe_divide(10, 2) = {}", safe_divide(10, 2));
    println!();
    println!("现在运行 `cargo test`，看看本 crate 的所有测试（单元 + 集成 + 文档）！");
}
