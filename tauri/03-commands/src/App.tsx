import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

/**
 * 单元 03 · 命令系统
 *
 * invoke("命令名", { 参数对象 }) 是前端调用 Rust 的唯一入口。
 * 每个演示卡片对应 lib.rs 中的一个 #[tauri::command]。
 */
interface OsInfo {
  os: string;
  arch: string;
  cpu_cores: number;
}

function App() {
  const [name, setName] = useState("");
  const [greetMsg, setGreetMsg] = useState("");

  const [a, setA] = useState("10");
  const [b, setB] = useState("0");
  const [divideMsg, setDivideMsg] = useState("");

  const [osInfo, setOsInfo] = useState<OsInfo | null>(null);

  const [ms, setMs] = useState("2000");
  const [pingMsg, setPingMsg] = useState("");
  const [pinging, setPinging] = useState(false);

  async function runGreet() {
    setGreetMsg(await invoke("greet", { name }));
  }

  async function runDivide() {
    try {
      setDivideMsg(`结果：${await invoke("divide", { a: Number(a), b: Number(b) })}`);
    } catch (e) {
      setDivideMsg(`错误：${e}`);
    }
  }

  async function runOsInfo() {
    setOsInfo(await invoke("get_os_info"));
  }

  async function runSlowPing() {
    setPinging(true);
    setPingMsg("等待中…");
    try {
      setPingMsg(await invoke("slow_ping", { ms: Number(ms) }));
    } catch (e) {
      setPingMsg(`错误：${e}`);
    } finally {
      setPinging(false);
    }
  }

  return (
    <main className="container">
      <h1>单元 03 · 命令系统</h1>
      <p className="subtitle">前端通过 invoke 调用 Rust 命令，体会参数 / 返回值 / 错误 / async</p>

      <section className="card">
        <h2>1 · 基础调用</h2>
        <form className="row" onSubmit={(e) => { e.preventDefault(); runGreet(); }}>
          <input value={name} onChange={(e) => setName(e.currentTarget.value)} placeholder="你的名字" />
          <button type="submit">greet</button>
        </form>
        <p className="output">{greetMsg}</p>
      </section>

      <section className="card">
        <h2>2 · 参数与错误处理</h2>
        <form className="row" onSubmit={(e) => { e.preventDefault(); runDivide(); }}>
          <input value={a} onChange={(e) => setA(e.currentTarget.value)} placeholder="a" />
          <span className="op">÷</span>
          <input value={b} onChange={(e) => setB(e.currentTarget.value)} placeholder="b" />
          <button type="submit">divide</button>
        </form>
        <p className={`output ${divideMsg.startsWith("错误") ? "error" : ""}`}>{divideMsg}</p>
      </section>

      <section className="card">
        <h2>3 · 返回结构体</h2>
        <button onClick={runOsInfo}>get_os_info</button>
        {osInfo && (
          <pre className="output json">
            {JSON.stringify(osInfo, null, 2)}
          </pre>
        )}
      </section>

      <section className="card">
        <h2>4 · async 命令</h2>
        <form className="row" onSubmit={(e) => { e.preventDefault(); runSlowPing(); }}>
          <input value={ms} onChange={(e) => setMs(e.currentTarget.value)} placeholder="毫秒" />
          <button type="submit" disabled={pinging}>slow_ping</button>
        </form>
        <p className="output">{pingMsg}</p>
      </section>
    </main>
  );
}

export default App;
