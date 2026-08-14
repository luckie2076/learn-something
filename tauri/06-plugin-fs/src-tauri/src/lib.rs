// 单元 06：注册官方插件 tauri-plugin-fs。
// 插件 = 「打包好的一组命令 + 一组权限」，前端通过 @tauri-apps/plugin-fs 调用。

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
