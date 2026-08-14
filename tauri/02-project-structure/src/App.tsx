import { useEffect, useState } from "react";
import { getName, getVersion, getTauriVersion } from "@tauri-apps/api/app";
import { getCurrentWindow } from "@tauri-apps/api/window";
import "./App.css";

/**
 * 单元 02 · 项目结构与配置
 *
 * 演示「配置驱动应用」：以下四个值分别来自
 * tauri.conf.json 的 productName / version、Cargo.toml 的 tauri 依赖版本、
 * app.windows[0].title。改配置 → 重启 dev → 界面变化。
 */
interface AppInfo {
  name: string;
  version: string;
  tauriVersion: string;
  windowTitle: string;
}

function App() {
  const [info, setInfo] = useState<AppInfo | null>(null);

  useEffect(() => {
    (async () => {
      const window = getCurrentWindow();
      setInfo({
        name: await getName(),
        version: await getVersion(),
        tauriVersion: await getTauriVersion(),
        windowTitle: await window.title(),
      });
    })();
  }, []);

  const rows = info
    ? [
        ["productName（tauri.conf.json）", info.name],
        ["version（tauri.conf.json）", info.version],
        ["tauri crate（Cargo.toml）", info.tauriVersion],
        ["app.windows[0].title", info.windowTitle],
      ]
    : [];

  return (
    <main className="container">
      <h1>单元 02 · 项目结构与配置</h1>
      <p className="subtitle">
        下面的信息不是硬编码的，而是 Tauri 运行时从配置文件里读出来的。
      </p>

      {info ? (
        <table className="config-table">
          <tbody>
            {rows.map(([label, value]) => (
              <tr key={label}>
                <td className="label">{label}</td>
                <td className="value">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>加载中…</p>
      )}

      <p className="hint">
        打开 <code>src-tauri/tauri.conf.json</code> 修改 productName 或窗口
        title，重启 <code>pnpm tauri dev</code>，观察变化。
      </p>
    </main>
  );
}

export default App;
