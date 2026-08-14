import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { LogicalSize, LogicalPosition } from "@tauri-apps/api/dpi";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import "./App.css";

/**
 * 单元 07 · 窗口管理
 *
 * 三个演示：
 * 1. Rust 命令创建第二个窗口（WebviewWindowBuilder）
 * 2. 动态调整当前窗口属性（尺寸/位置/标题/全屏/最小化/最大化）
 * 3. 通过 getByLabel 遥控另一个窗口
 */
const win = getCurrentWindow();

function App() {
  const [label, setLabel] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    setLabel(win.label); // label 是属性（字符串），不是方法
  }, []);

  // 第二个窗口只显示占位说明
  if (label === "second") {
    return (
      <main className="container">
        <h1>我是第二个窗口</h1>
        <p className="subtitle">label: second · 由 Rust 的 WebviewWindowBuilder 创建</p>
        <p>回到主窗口试试「遥控第二个窗口」按钮。</p>
      </main>
    );
  }

  async function run(action: () => Promise<unknown>, okMsg: string) {
    try {
      await action();
      setMsg(okMsg);
    } catch (e) {
      setMsg(`失败：${e}`);
    }
  }

  return (
    <main className="container">
      <h1>单元 07 · 窗口管理</h1>
      <p className="subtitle">当前窗口 label: {label || "…"} · 窗口操作由 capabilities 精确授权</p>

      <section className="card">
        <h2>1 · 创建第二个窗口</h2>
        <button onClick={() => run(() => invoke("create_second_window"), "已创建 second 窗口")}>
          WebviewWindowBuilder 创建
        </button>
      </section>

      <section className="card">
        <h2>2 · 调整当前窗口</h2>
        <div className="btn-group">
          <button onClick={() => run(() => win.setTitle("标题被改了"), "setTitle 成功")}>改标题</button>
          <button onClick={() => run(() => win.setSize(new LogicalSize(600, 400)), "setSize 成功")}>改尺寸 600×400</button>
          <button onClick={() => run(() => win.setPosition(new LogicalPosition(100, 100)), "setPosition 成功")}>移位置 (100,100)</button>
          <button onClick={() => run(() => win.setFullscreen(true), "全屏")}>全屏</button>
          <button onClick={() => run(() => win.setFullscreen(false), "退出全屏")}>退出全屏</button>
          <button onClick={() => run(() => win.maximize(), "最大化")}>最大化</button>
          <button onClick={() => run(() => win.unmaximize(), "还原")}>还原</button>
          <button onClick={() => run(() => win.minimize(), "最小化")}>最小化</button>
          <button onClick={() => run(() => win.unminimize(), "恢复")}>恢复</button>
        </div>
      </section>

      <section className="card">
        <h2>3 · 遥控第二个窗口（getByLabel）</h2>
        <div className="btn-group">
          <button
            onClick={() =>
              run(async () => {
                const second = await WebviewWindow.getByLabel("second");
                if (!second) throw new Error("second 窗口不存在，先创建");
                await second.setTitle("被遥控的标题");
              }, "已把 second 窗口标题改掉")
            }
          >
            改 second 标题
          </button>
          <button
            onClick={() =>
              run(async () => {
                const second = await WebviewWindow.getByLabel("second");
                if (!second) throw new Error("second 窗口不存在，先创建");
                await second.close();
              }, "已关闭 second 窗口")
            }
          >
            关闭 second
          </button>
        </div>
      </section>

      <p className={`output ${msg.startsWith("失败") ? "error" : ""}`}>{msg}</p>
    </main>
  );
}

export default App;
