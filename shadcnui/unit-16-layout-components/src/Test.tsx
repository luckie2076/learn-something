export default function App() {
  return (
    <div className="flex">
      {/* 侧边栏 */}
      <div className="w-64"></div>

      <div className="fixed w-64 bg-gray-500 top-0 left-0 p-4 overflow-auto overscroll-auto">
        <div className="bg-red-400">abc</div>
      </div>

      {/* 主内容 */}
      <div className="bg-gray-300 flex-1 overflow-auto overscroll-none">
        <div>
          aa
          <div className="h-250 w-32 bg-green-700" />
        </div>
      </div>
    </div>
  );
}
