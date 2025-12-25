mod commands;

use std::path::PathBuf;
use tauri::Emitter;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .setup(|app| {
            // Get CLI arguments
            let args: Vec<String> = std::env::args().collect();

            // If there's a path argument, emit an event to open it
            if args.len() > 1 {
                let path_arg = &args[1];

                // Resolve the path (handle "." for current directory)
                let resolved_path = if path_arg == "." {
                    std::env::current_dir().ok()
                } else {
                    PathBuf::from(path_arg).canonicalize().ok()
                };

                if let Some(path) = resolved_path {
                    if let Some(path_str) = path.to_str() {
                        // Emit event to frontend
                        let _ = app.emit("open-folder", path_str);
                    }
                }
            }

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            commands::get_file_tree,
            commands::read_file,
            commands::write_file,
            commands::watch_file
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
