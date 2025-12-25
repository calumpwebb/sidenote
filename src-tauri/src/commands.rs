use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use notify::{Watcher, RecursiveMode, RecommendedWatcher, Config, Event, EventKind};
use std::sync::mpsc::channel;
use std::thread;
use tauri::Emitter;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct FileNode {
    pub name: String,
    pub path: String,
    pub is_directory: bool,
    pub children: Option<Vec<FileNode>>,
}

#[tauri::command]
pub fn get_file_tree(root_path: String) -> Result<Vec<FileNode>, String> {
    let path = PathBuf::from(&root_path);

    if !path.exists() {
        return Err("Path does not exist".to_string());
    }

    if !path.is_dir() {
        return Err("Path is not a directory".to_string());
    }

    build_tree(&path)
}

fn build_tree(dir: &PathBuf) -> Result<Vec<FileNode>, String> {
    let mut nodes = Vec::new();

    let entries = fs::read_dir(dir)
        .map_err(|e| format!("Failed to read directory: {}", e))?;

    for entry in entries {
        let entry = entry.map_err(|e| format!("Failed to read entry: {}", e))?;
        let path = entry.path();
        let name = entry.file_name().to_string_lossy().to_string();

        // Skip hidden files/folders
        if name.starts_with('.') {
            continue;
        }

        if path.is_dir() {
            // Recursively build tree for subdirectory
            match build_tree(&path) {
                Ok(children) => {
                    // Only include directory if it has markdown files (directly or in subdirectories)
                    if !children.is_empty() {
                        nodes.push(FileNode {
                            name,
                            path: path.to_string_lossy().to_string(),
                            is_directory: true,
                            children: Some(children),
                        });
                    }
                }
                Err(_) => continue, // Skip directories we can't read
            }
        } else {
            // Only include .md and .mdx files
            if let Some(extension) = path.extension() {
                let ext = extension.to_string_lossy().to_lowercase();
                if ext == "md" || ext == "mdx" {
                    nodes.push(FileNode {
                        name,
                        path: path.to_string_lossy().to_string(),
                        is_directory: false,
                        children: None,
                    });
                }
            }
        }
    }

    // Sort: directories first, then files, alphabetically within each group
    nodes.sort_by(|a, b| {
        match (a.is_directory, b.is_directory) {
            (true, false) => std::cmp::Ordering::Less,
            (false, true) => std::cmp::Ordering::Greater,
            _ => a.name.to_lowercase().cmp(&b.name.to_lowercase()),
        }
    });

    Ok(nodes)
}

#[tauri::command]
pub fn read_file(path: String) -> Result<String, String> {
    fs::read_to_string(&path)
        .map_err(|e| format!("Failed to read file: {}", e))
}

#[tauri::command]
pub fn write_file(path: String, content: String) -> Result<(), String> {
    fs::write(&path, content)
        .map_err(|e| format!("Failed to write file: {}", e))
}

#[tauri::command]
pub fn watch_file(app_handle: tauri::AppHandle, path: String) -> Result<(), String> {
    let (tx, rx) = channel();

    // Create a watcher
    let mut watcher = RecommendedWatcher::new(
        move |res: Result<Event, notify::Error>| {
            if let Ok(event) = res {
                let _ = tx.send(event);
            }
        },
        Config::default(),
    ).map_err(|e| format!("Failed to create watcher: {}", e))?;

    // Watch the file
    let watch_path = PathBuf::from(&path);
    watcher.watch(&watch_path, RecursiveMode::NonRecursive)
        .map_err(|e| format!("Failed to watch file: {}", e))?;

    // Spawn a thread to listen for events
    thread::spawn(move || {
        // Keep watcher alive
        let _watcher = watcher;

        for event in rx {
            // Only emit on modify events
            if matches!(event.kind, EventKind::Modify(_)) {
                let _ = app_handle.emit("file-changed", path.clone());
            }
        }
    });

    Ok(())
}
