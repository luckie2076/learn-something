// ===== 子模块文件:src/utils/strings.rs =====
// 由 utils.rs 的 `pub mod strings;` 引入。

// 使用第三方 crate:unicode-segmentation(由 cargo add 引入,Cargo.toml 的 [dependencies])
use unicode_segmentation::UnicodeSegmentation;

/// 统计"用户感知的字符数":按 Unicode 字素簇(grapheme)分割,
/// 而不是按字节数(中文等 UTF-8 字符一个就有 3 个字节)。
pub fn char_count(s: &str) -> usize {
    s.graphemes(true).count()
}

/// 按空白切分,统计单词数
pub fn count_words(s: &str) -> usize {
    s.split_whitespace().count()
}
