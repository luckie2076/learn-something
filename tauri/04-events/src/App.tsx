import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen, emit, type UnlistenFn } from "@tauri-apps/api/event";
import "./App.css";

/**
 * 单元 04 · 事件系统
 *
 * 方向 1：Rust 主动 emit（start_download），前端 listen 接收进度。
 * 方向 2：前端 emit（frontend-ping），Rust 监听后回发 backend-pong。
 */
function App() {
  const [status, setStatus] = useState("点击按钮开始下载");
  const [progress, setProgress] = useState(0);

  const [pingMsg, setPingMsg] = useState("");
  const [pongMsg, setPongMsg] = useState("");

  useEffect(() => {
    let unlistenList: UnlistenFn[] = [];

    (async () => {
      unlistenList.push(
        await listen<string>("download-started", (e) => {
          setStatus(e.payload);
          setProgress(0);
        })
      );
      unlistenList.push(
        await listen<number>("download-progress", (e) => {
          setProgress(e.payload);
          setStatus(`下载中… ${e.payload}%`);
        })
      );
      unlistenList.push(
        await listen<string>("download-finished", (e) => {
          setStatus(e.payload);
        })
      );
      unlistenList.push(
        await listen<string>("backend-pong", (e) => {
          setPongMsg(e.payload);
        })
      );
    })();

    return () => unlistenList.forEach((fn) => fn());
  }, []);

  async function startDownload() {
    await invoke("start_download");
  }

  function sendPing() {
    emit("frontend-ping", pingMsg || "（空消息）");
  }

  return (
    <main className="container">
      <h1>单元 04 · 事件系统</h1>
      <p className="subtitle">Rust 与前端之间的「主动通知」，与 invoke 的「一问一答」互补</p>

      <section className="card">
        <h2>方向 1 · Rust → 前端（emit / listen）</h2>
        <button onClick={startDownload}>start_download</button>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <p className="output">{status}</p>
      </section>

      <section className="card">
        <h2>方向 2 · 前端 → Rust → 前端（完整回路）</h2>
        <form
          className="row"
          onSubmit={(e) => {
            e.preventDefault();
            sendPing();
          }}
        >
          <input
            value={pingMsg}
            onChange={(e) => setPingMsg(e.currentTarget.value)}
            placeholder="发一条消息给 Rust…"
          />
          <button type="submit">emit ping</button>
        </form>
        <p className="output">{pongMsg}</p>
      </section>
    </main>
  );
}

export default App;
