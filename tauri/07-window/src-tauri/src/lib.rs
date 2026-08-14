use tauri::{WebviewUrl, WebviewWindowBuilder};

/// Rust 侧创建第二个窗口（可信代码，无需前端权限）。
/// label 是窗口唯一标识，之后前端可用 getByLabel("second") 找到它。
#[tauri::command]
fn create_second_window(app: tauri::AppHandle) -> Result<(), String> {
    WebviewWindowBuilder::new(&app, "second", WebviewUrl::App("index.html".into()))
        .title("第二个窗口")
        .inner_size(480.0, 360.0)
        .build()
        .map_err(|e| e.to_string())?;
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![create_second_window])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
