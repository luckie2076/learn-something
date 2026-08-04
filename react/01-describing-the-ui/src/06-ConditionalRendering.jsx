// 条件渲染的本质：用 JavaScript 控制「渲染什么」。
// JSX 本身没有 if/else 语法，所以借用 JS 的三种惯用法：
export default function Demo() {
  const isLoggedIn = true
  const messages = []

  return (
    <div>
      {/* 1) 三元表达式 ? : —— 二选一 */}
      {isLoggedIn ? <p>欢迎回来</p> : <p>请登录</p>}

      {/* 2) && 短路 —— 只在条件为真时渲染，否则什么都不渲染 */}
      {messages.length > 0 && <p>你有 {messages.length} 条消息</p>}

      {/* 3) 提前 return —— 把组件函数写成“满足条件就直接返回某个 UI” */}
    </div>
  )
}
