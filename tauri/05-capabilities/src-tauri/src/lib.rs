// 单元 05 只保留最核心的 Builder：没有自定义命令、没有多余插件。
// 演示重点是 capabilities（权限声明）如何控制前端可调用的系统 API。

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
