// JSX 本身没有 if/else 语法——但你可以用 JavaScript 来控制渲染什么。
// 三元表达式 ? : 是最常用的「二选一」模式：
// 条件 ? 渲染A : 渲染B
const isLoggedIn = false
const username = 'Ada'

export default function Demo() {
  return (
    <div>
      {isLoggedIn
        ? <p style={{ color: 'green' }}>欢迎回来，{username}！</p>
        : <p style={{ color: 'red' }}>请先登录</p>
      }
    </div>
  )
}
