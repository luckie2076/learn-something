// ===== 库根（src/lib.rs）：所有逻辑都放这里 =====
// 库的好处：可被第三方 `use`、可写单元/集成/文档测试（stage-9）、
// 可用 `cargo doc` 生成 API 文档（本 stage）。

/// 统计单词数：按空白符切分，空文本返回 0。
///
/// # 示例（文档测试，`cargo test` 会自动运行）
///
/// ```
/// use strtools::count_words;
///
/// assert_eq!(count_words("hello rust world"), 3);
/// assert_eq!(count_words(""), 0);
/// ```
pub fn count_words(text: &str) -> usize {
    text.split_whitespace().count()
}

/// 转 ASCII 大写（非 ASCII 字符原样保留）。
///
/// # 示例
///
/// ```
/// use strtools::to_ascii_upper;
///
/// assert_eq!(to_ascii_upper("rust"), "RUST");
/// ```
pub fn to_ascii_upper(text: &str) -> String {
    text.to_ascii_uppercase()
}

/// 反转字符串：按 Unicode 字符边界反转，正确处理中文。
///
/// # 示例
///
/// ```
/// use strtools::reverse;
///
/// assert_eq!(reverse("rust"), "tsur");
/// assert_eq!(reverse("你好"), "好你");
/// ```
pub fn reverse(text: &str) -> String {
    text.chars().rev().collect()
}

// ===== 单元测试（stage-9 已学，这里保持惯例）=====
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn count_words_works() {
        assert_eq!(count_words("a b c"), 3);
        assert_eq!(count_words("  多个  空白  "), 2);
        assert_eq!(count_words(""), 0);
    }

    #[test]
    fn upper_works() {
        assert_eq!(to_ascii_upper("rust 2024"), "RUST 2024");
    }

    #[test]
    fn reverse_works() {
        assert_eq!(reverse("abc"), "cba");
        assert_eq!(reverse("你好，世界"), "界世，好你");
    }
}
