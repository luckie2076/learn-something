// 一个极简模块：只导出对外需要的接口，内部实现对外不可见。
export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

// 未被 export 的，外部无法访问（模块作用域隔离）。
function secret() {
  return 42;
}
