// 单元 08：保留最简命令，验证「开发可用 → 打包可用」。
#[tauri::command]
fn greet(name: &str) -> String {
    format!("你好，{name}！这是打包版应用中的 Rust 命令。")
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
