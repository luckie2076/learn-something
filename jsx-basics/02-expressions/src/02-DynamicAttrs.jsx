// 大括号也可以用在属性值上，让属性「动态」变化。
// 属性值可以是字符串、数字、布尔值、数组、对象——但最终会按 React 的规则处理。
const user = {
  name: '张三',
  avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Zhang',
}

export default function Demo() {
  return (
    <div>
      <img src={user.avatar} alt={user.name} width={48} height={48} />
      <p title={`用户：${user.name}`}>
        鼠标悬停看 tooltip —— 属性也是用 {} 绑定的
      </p>
      <input type="text" placeholder={`搜索 ${user.name} 的内容`} disabled={false} />
    </div>
  )
}
