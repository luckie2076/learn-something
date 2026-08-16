// ===== 库根（src/lib.rs）：核心逻辑都放这里，才能被测试 =====
// main.rs 里的代码没法被测试/复用，逻辑写进 lib 才是可测的基础（呼应 stage-8）。

/// 返回两数之和（演示用的极简函数）。
///
/// # 示例（这是文档测试，`cargo test` 会自动运行它）
///
/// ```
/// use stage_9_testing::add;
///
/// assert_eq!(add(2, 3), 5);
/// ```
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}

/// 判断是否为偶数（私有函数：单元测试可以直接测它，集成测试不行）。
fn is_even(n: i32) -> bool {
    n % 2 == 0
}

/// 返回数字的奇偶描述（生产代码也用到私有函数 `is_even`，
/// 所以它不会成为"死代码"——真实项目中私有辅助函数通常就是这样被公共函数调用的）。
///
/// # 示例
///
/// ```
/// use stage_9_testing::parity;
///
/// assert_eq!(parity(4), "even");
/// assert_eq!(parity(7), "odd");
/// ```
pub fn parity(n: i32) -> &'static str {
    if is_even(n) { "even" } else { "odd" }
}

/// 安全的除法：除数为 0 时 panic（演示 `#[should_panic]`）。
pub fn safe_divide(a: i32, b: i32) -> i32 {
    assert!(b != 0, "除数不能为 0");
    a / b
}

// ===== 单元测试模块 =====
// #[cfg(test)]：只在 `cargo test` 编译时才带上这段代码，
// 正常 `cargo build` / `cargo run` 时它完全不存在，不影响产物大小。

#[cfg(test)]
mod tests {
    // 把父模块的所有名字引入测试作用域，才能直接测 add / is_even 等。
    use super::*;

    #[test]
    fn add_works() {
        assert_eq!(add(2, 3), 5);
    }

    #[test]
    fn add_handles_negatives() {
        assert_eq!(add(-1, -1), -2);
        assert_eq!(add(-5, 5), 0);
    }

    #[test]
    fn private_fn_is_testable() {
        // 单元测试和被测代码同处一个 crate，私有函数可以直接测
        assert!(is_even(4));
        assert!(!is_even(7));
    }

    #[test]
    fn parity_works() {
        assert_eq!(parity(4), "even");
        assert_eq!(parity(7), "odd");
    }

    #[test]
    #[should_panic(expected = "除数不能为 0")]
    fn divide_by_zero_panics() {
        safe_divide(1, 0); // 正常会 panic；#[should_panic] 让它"通过"
    }
}
