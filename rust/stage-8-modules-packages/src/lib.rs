// ===== 库根(src/lib.rs):模块声明 + re-export =====

// 声明子模块:pub 表示对外公开这个模块。
// 编译器会去对应文件找代码(2024 edition 的新文件组织风格):
//   pub mod geometry;  → src/geometry.rs
//   pub mod utils;     → src/utils.rs(utils 的子模块在 src/utils/ 目录里)
pub mod geometry;
pub mod utils;

// 库根自己也可以直接放代码
pub fn greet(name: &str) -> String {
    format!("你好, {name}!")
}

// ===== re-export(重导出):把深层路径"提"到 crate 根 =====
// 这样外部使用者可以写 stage_8_modules_packages::Circle,
// 而不必知道 Circle 其实定义在 geometry 模块里。
pub use geometry::{Circle, Point};
pub use utils::strings::{char_count, count_words};
