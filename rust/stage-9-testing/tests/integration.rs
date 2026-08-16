// ===== 集成测试（tests/ 目录）=====
// 每个文件是一个独立的 crate，只能通过**公共 API**（use stage_9_testing::...）来测，
// 看不到 lib 内部的私有函数。这正好和单元测试互补。

use stage_9_testing::add;

#[test]
fn add_works_via_public_api() {
    assert_eq!(add(1, 2), 3);
    assert_eq!(add(-100, 100), 0);
}
