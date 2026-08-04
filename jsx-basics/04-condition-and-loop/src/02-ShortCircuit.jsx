// && 短路运算：只有当左侧为 true 时，才渲染右侧的内容。
// 原理：JavaScript 中，false && <Component/> 直接短路返回 false，
// React 遇到 false、null、undefined 时什么都不渲染。
const unreadCount = 5

export default function Demo() {
  return (
    <div>
      {/* 有未读消息时才显示红点 */}
      {unreadCount > 0 && (
        <p style={{ background: '#ff4757', color: '#fff', padding: '4px 12px', borderRadius: 12, display: 'inline-block' }}>
          {unreadCount} 条未读消息
        </p>
      )}
      {/* unreadCount 为 0 时，什么都不渲染 */}
    </div>
  )
}
