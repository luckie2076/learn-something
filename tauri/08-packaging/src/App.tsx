import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { getName, getVersion } from "@tauri-apps/api/app";
import "./App.css";

/**
 * 单元 08 · 打包发布
 *
 * 运行 `pnpm tauri build` 后，应用名与版本号会写入安装包
 * （tauri.conf.json 的 productName / version）。
 * 本演示验证「配置 → 安装包 → 运行时读取」的完整链路。
 */
function App() {
  const [name, setName] = useState("");
  const [version, setVersion] = useState("");
  const [greetMsg, setGreetMsg] = useState("");

  useEffect(() => {
    (async () => {
      setName(await getName());
      setVersion(await getVersion());
    })();
  }, []);

  async function greet() {
    setGreetMsg(await invoke("greet", { name: "打包测试" }));
  }

  return (
    <main className="container">
      <h1>单元 08 · 打包发布</h1>
      <p className="subtitle">
        {name} v{version} · 这两个值来自 tauri.conf.json，构建后写入安装包
      </p>

      <button onClick={greet}>调用 Rust 命令</button>
      <p className="output">{greetMsg}</p>

      <p className="hint">
        在本目录执行 <code>pnpm tauri build</code>，
        产物在 <code>src-tauri/target/release/bundle/</code> 下。
      </p>
    </main>
  );
}

export default App;
