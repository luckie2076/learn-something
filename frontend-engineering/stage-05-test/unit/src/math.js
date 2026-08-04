// 被测单元：一个极简计算模块。
// 教学用意：用最小、最贴近真实业务的代码，展示「给纯函数写单元测试」长什么样。
export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

// 带业务规则的例子：计算折扣价。rate 是 0~1 的折扣比例（如 0.2 表示打 8 折）。
// 故意加了边界判断——这种「容易错、容易变」的逻辑，正是单元测试最该覆盖的地方。
export function calculateDiscount(price, rate) {
  if (price < 0) throw new Error('price must be >= 0');
  if (rate < 0 || rate > 1) throw new Error('rate must be between 0 and 1');
  // 保留两位小数的安全写法（避免 0.1 + 0.2 类浮点误差）。
  return Math.round(price * (1 - rate) * 100) / 100;
}
