// props 是父组件传给子组件的「只读」数据，本质上就是函数参数。
// 为什么是只读？因为纯组件（见第 8 节）要求同样的输入得到同样的输出，
// 子组件不能反过来修改父组件传来的数据，数据流才能保持单向、可预测。
function Avatar({ person, size = 80 }) {
  return (
    <div style={{ textAlign: 'center', display: 'inline-block', margin: 8 }}>
      <div
        style={{
          width: size,
          height: size,
          lineHeight: `${size}px`,
          borderRadius: '50%',
          background: '#888',
          color: '#fff',
          fontSize: size / 2,
        }}
      >
        {person.name[0]}
      </div>
      <p>{person.name}</p>
    </div>
  )
}

export default function Demo() {
  const user = { name: 'Lin', city: 'Beijing' }
  return <Avatar person={user} size={100} />
}
