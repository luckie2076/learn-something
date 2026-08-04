// HTML 和 JSX 属性命名差异：
// 1. class → className（因为 class 是 JS 保留字）
// 2. for → htmlFor（同理，for 也是 JS 保留字）
// 3. tabindex → tabIndex（camelCase）

// 布尔属性：只要写了就是 true
const disabled = true

export default function Demo() {
  return (
    <div>
      <label htmlFor="username">用户名：</label>
      <input id="username" className="input-field" placeholder="请输入" disabled={disabled} />
      <p style={{ marginTop: 8, fontSize: 14, color: '#666' }}>
        className 替换 class，htmlFor 替换 for
      </p>
    </div>
  )
}
