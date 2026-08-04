// 纯函数：同样的输入永远得到同样的输出，且不读写函数外部的“可变”状态。
// 为什么对 React 至关重要？React 可能多次调用你的组件（开发模式下 StrictMode 会渲染两次）。
// 纯函数保证“多次调用结果一致”，不会出现“点一下变了两次”“刷新顺序错乱”之类的诡异 bug。

// 纯：只依赖输入，不改外部
function double(n) {
  return n * 2
}

// 不纯：改了函数外部的数组（副作用）
let cart = []
function addImpure(item) {
  cart.push(item)
}

export default function Demo() {
  return (
    <div>
      <p>double(3) = {double(3)}</p>
      <p>double(3) 永远是 {double(3)} —— 纯函数可预测</p>
    </div>
  )
}
