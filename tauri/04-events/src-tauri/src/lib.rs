use std::time::Duration;
use tauri::{AppHandle, Emitter, Listener};

/// 方向 1：Rust → 前端。
/// 前端调用此命令后，Rust 主动 emit 一串事件，前端 listen 接收。
#[tauri::command]
async fn start_download(app: AppHandle) {
    let _ = app.emit("download-started", "开始下载…");

    for progress in [10, 30, 60, 85, 100] {
        tokio::time::sleep(Duration::from_millis(400)).await;
        let _ = app.emit("download-progress", progress);
    }

    let _ = app.emit("download-finished", "下载完成!");
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            // 方向 2：前端 → Rust → 前端（完整回路）。
            // 在 setup 阶段注册 Rust 端监听器；收到 frontend-ping 后回发 backend-pong。
            let app_handle = app.handle().clone();
            app.listen("frontend-ping", move |event| {
                let _ = app_handle.emit(
                    "backend-pong",
                    format!("Rust 收到: {}", event.payload()),
                );
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![start_download])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
