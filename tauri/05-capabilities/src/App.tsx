import { useEffect, useState } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import "./App.css";

/**
 * 单元 05 · 权限与能力系统
 *
 * 演示核心：window.setTitle 需要 `core:window:allow-set-title` 权限。
 * 当前 capabilities/default.json 只声明了 `core:default`（不含该权限），
 * 所以调用会被拒绝——这就是「最小权限」在起作用。
 *
 * 试一试：在 default.json 的 permissions 中加入
 *   "core:window:allow-set-title"
 * 后重启 `pnpm tauri dev`，再点按钮即可成功。
 */
const CAPABILITY_SNIPPET = `{
  "identifier": "default",
  "windows": ["main"],
  "permissions": [
    "core:default",
    "core:window:allow-set-title"   // ← 加这一行后 setTitle 才能用
  ]
}`;

function App() {
  const [title, setTitle] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    getCurrentWindow().title().then(setTitle);
  }, []);

  async function trySetTitle() {
    try {
      await getCurrentWindow().setTitle("新标题 — 权限生效");
      setTitle(await getCurrentWindow().title());
      setMsg("成功！窗口标题已改变。");
    } catch (e) {
      setMsg(`被拒绝：${e}（当前未授予 set-title 权限）`);
    }
  }

  return (
    <main className="container">
      <h1>单元 05 · 权限与能力系统</h1>
      <p className="subtitle">当前窗口标题：{title}</p>

      <section className="card">
        <h2>实验 · window.setTitle 需要授权</h2>
        <button onClick={trySetTitle}>调用 window.setTitle</button>
        <p className={`output ${msg.startsWith("被拒绝") ? "error" : ""}`}>{msg}</p>
      </section>

      <section className="card">
        <h2>当前能力声明 capabilities/default.json</h2>
        <pre className="code-block">
{`{
  "$schema": "../gen/schemas/desktop-schema.json",
  "identifier": "default",
  "description": "Default capability for the main window",
  "windows": ["main"],
  "permissions": ["core:default"]
}`}
        </pre>
        <p className="hint">加入权限后，把上面的 JSON 改成这样：</p>
        <pre className="code-block">{CAPABILITY_SNIPPET}</pre>
      </section>
    </main>
  );
}

export default App;
