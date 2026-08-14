import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

/**
 * 单元 01 · 环境搭建与 Hello World
 *
 * 这是 create-tauri-app 模板自带的 greet 演示，是 Tauri 的 "Hello World"：
 * 前端通过 invoke("greet", ...) 调用 Rust 后端命令（细节见单元 03）。
 * 本单元只验证一件事：环境跑通了，前后端能对话。
 */
function App() {
  const [name, setName] = useState("");
  const [greetMsg, setGreetMsg] = useState("");

  async function greet() {
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <main className="container">
      <h1>Tauri 单元 01 · 环境搭建</h1>
      <p className="subtitle">
        下面这行文字来自 Rust 后端命令，说明「脚手架 + tauri dev」已跑通。
      </p>

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="输入你的名字…"
        />
        <button type="submit">Greet</button>
      </form>

      <p className="result">{greetMsg}</p>
    </main>
  );
}

export default App;
