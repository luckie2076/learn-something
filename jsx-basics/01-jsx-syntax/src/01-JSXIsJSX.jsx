// JSX 是 JavaScript 的语法扩展，让你在 JS 里直接写类似 HTML 的标签。
// 关键认知 1：JSX 不是字符串，不是 HTML，它是 React.createElement(...) 的语法糖。
// 关键认知 2：浏览器不认识 JSX，Vite 借助 @vitejs/plugin-react 在编译期把它转成普通 JS。
export default function Demo() {
  return <p>你好，这是 JSX</p>
}
