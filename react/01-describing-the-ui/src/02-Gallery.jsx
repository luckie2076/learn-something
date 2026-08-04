import Profile from './02-Profile.jsx'

// Gallery 在同一文件里使用了 Profile。
export default function Gallery() {
  return (
    <section>
      <h3>科学家画廊</h3>
      <Profile />
      <Profile />
      <Profile />
    </section>
  )
}
