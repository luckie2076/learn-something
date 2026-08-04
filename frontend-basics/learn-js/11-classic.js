// 经典脚本：没有 export，顶层声明直接进入全局作用域（window）。
// 这就是"全局污染"的来源——多个文件里同名变量会互相覆盖。
function greet(name) {
  return "你好，" + name;
}
