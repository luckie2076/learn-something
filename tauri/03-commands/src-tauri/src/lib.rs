use serde::Serialize;

/// 1. 最基础的命令：接收参数，返回字符串。
/// 前端调用：invoke("greet", { name: "Tauri" })
#[tauri::command]
fn greet(name: &str) -> String {
    format!("你好，{name}！这是来自 Rust 的问候。")
}

/// 2. 错误处理：返回 Result。
/// Ok(值) 会让前端 Promise resolve，Err(信息) 会 reject。
/// 前端调用：invoke("divide", { a: 10, b: 0 })
#[tauri::command]
fn divide(a: f64, b: f64) -> Result<f64, String> {
    if b == 0.0 {
        Err("除数不能为零".to_string())
    } else {
        Ok(a / b)
    }
}

/// 3. 返回结构体：只要字段类型可序列化（Serialize），
/// 前端拿到的就是一个普通 JS 对象。
#[derive(Serialize)]
struct OsInfo {
    os: &'static str,
    arch: &'static str,
    cpu_cores: usize,
}

#[tauri::command]
fn get_os_info() -> OsInfo {
    OsInfo {
        os: std::env::consts::OS,
        arch: std::env::consts::ARCH,
        cpu_cores: std::thread::available_parallelism()
            .map(|n| n.get())
            .unwrap_or(1),
    }
}

/// 4. async 命令：不阻塞事件循环，适合耗时操作（IO、网络…）。
/// 必须返回 Result。这里用 tokio 的 sleep 模拟耗时任务。
#[tauri::command]
async fn slow_ping(ms: u64) -> Result<String, String> {
    if ms > 5000 {
        return Err("最长只支持 5000 毫秒".to_string());
    }
    tokio::time::sleep(std::time::Duration::from_millis(ms)).await;
    Ok(format!("等待 {ms} 毫秒后返回（async 命令）"))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            divide,
            get_os_info,
            slow_ping
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
