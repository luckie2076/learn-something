import { useState } from "react";
import { appDataDir, homeDir } from "@tauri-apps/api/path";
import { readTextFile, writeTextFile, BaseDirectory } from "@tauri-apps/plugin-fs";
import "./App.css";

/**
 * 单元 06 · 插件与文件系统
 *
 * 演示闭环：先写文件（$APPDATA/notes.txt）→ 再读出来。
 * 权限（capabilities/default.json）只允许读写 $APPDATA/** 下的文本文件，
 * 试试读取其他绝对路径，会被权限作用域拒绝。
 */
function App() {
  const [content, setContent] = useState("第一条笔记：Tauri 的文件系统真方便！");
  const [dirs, setDirs] = useState("");
  const [writeMsg, setWriteMsg] = useState("");
  const [readMsg, setReadMsg] = useState("");
  const [readPath, setReadPath] = useState("notes.txt");

  async function showDirs() {
    setDirs(
      `appDataDir: ${await appDataDir()}\nhomeDir:   ${await homeDir()}`
    );
  }

  async function writeFile() {
    try {
      await writeTextFile("notes.txt", content, {
        baseDir: BaseDirectory.AppData,
      });
      setWriteMsg("写入成功（$APPDATA/notes.txt）");
    } catch (e) {
      setWriteMsg(`写入失败：${e}`);
    }
  }

  async function readFile() {
    try {
      const text = await readTextFile(readPath, {
        baseDir: BaseDirectory.AppData,
      });
      setReadMsg(text);
    } catch (e) {
      setReadMsg(`读取失败：${e}`);
    }
  }

  return (
    <main className="container">
      <h1>单元 06 · 插件与文件系统</h1>
      <p className="subtitle">tauri-plugin-fs：读写文件的完整闭环，权限限定在应用数据目录</p>

      <section className="card">
        <h2>1 · 路径解析（@tauri-apps/api/path）</h2>
        <button onClick={showDirs}>显示系统路径</button>
        <pre className="output json">{dirs}</pre>
      </section>

      <section className="card">
        <h2>2 · 写入文件（$APPDATA/notes.txt）</h2>
        <textarea
          value={content}
          onChange={(e) => setContent(e.currentTarget.value)}
          rows={3}
        />
        <button onClick={writeFile}>writeTextFile</button>
        <p className={`output ${writeMsg.startsWith("写入失败") ? "error" : ""}`}>{writeMsg}</p>
      </section>

      <section className="card">
        <h2>3 · 读取文件（默认读 notes.txt）</h2>
        <form
          className="row"
          onSubmit={(e) => {
            e.preventDefault();
            readFile();
          }}
        >
          <input
            value={readPath}
            onChange={(e) => setReadPath(e.currentTarget.value)}
            placeholder="相对路径（相对 AppData）或绝对路径"
          />
          <button type="submit">readTextFile</button>
        </form>
        <pre className="output json">{readMsg}</pre>
        <p className="hint">
          提示：输入绝对路径（如 /etc/hosts）会因 capabilities 作用域限制而被拒绝。
        </p>
      </section>
    </main>
  );
}

export default App;
