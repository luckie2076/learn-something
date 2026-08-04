// 用大括号 {} 在 JSX 里嵌入任意 JavaScript 表达式。
// 表达式是什么？能放在等号右边求值的都算——变量、运算、函数调用、模板字符串…
// 注意：大括号里不能写语句（if、for 等），只能写表达式。
const name = 'Ada'
const now = new Date().toLocaleDateString('zh-CN')

export default function Demo() {
  return (
    <div>
      <p>你好，{name}！</p>
      <p>今天是：{now}</p>
      <p>1 + 1 = {1 + 1}</p>
      <p>大写名字：{name.toUpperCase()}</p>
    </div>
  )
}
