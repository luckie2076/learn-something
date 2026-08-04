// JSX 让你在 JS 里直接书写类似 HTML 的标签。
// 关键点：JSX 不是字符串，也不是真正的 HTML，它是 React.createElement(...) 的语法糖。
// 浏览器不认识 JSX，由 Vite（借助 @vitejs/plugin-react）在编译期把它转成普通 JS。
export default function TodoList() {
  return (
    <ul>
      <li>写代码</li>
      <li>编译</li>
      <li>提交</li>
    </ul>
  )
}
