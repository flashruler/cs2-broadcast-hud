use tauri::{Manager, Emitter};
use std::sync::{Arc, Mutex};

// Global state for condensed mode
static CONDENSED_MODE: Mutex<bool> = Mutex::new(false);

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn create_overlay_window(app: tauri::AppHandle) -> Result<(), String> {
    let window = app.get_webview_window("overlay");
    
    if let Some(existing_window) = window {
        // Window already exists, just show it
        existing_window.show().map_err(|e| e.to_string())?;
        existing_window.set_focus().map_err(|e| e.to_string())?;
    } else {
        // Create new overlay window
        let _overlay_window = tauri::WebviewWindowBuilder::new(
            &app,
            "overlay",
            tauri::WebviewUrl::App("/overlay".into())
        )
        .title("CS2 HUD Overlay")
        .inner_size(1920.0, 1080.0)
        .transparent(false)
        .resizable(true)
        .build()
        .map_err(|e| e.to_string())?;
    }
    
    Ok(())
}

#[tauri::command]
async fn toggle_condensed_mode(app: tauri::AppHandle) -> Result<bool, String> {
    let mut condensed = CONDENSED_MODE.lock().map_err(|e| e.to_string())?;
    *condensed = !*condensed;
    let new_state = *condensed;
    
    // Emit event to all windows about the state change
    app.emit("condensed-mode-changed", new_state).map_err(|e| e.to_string())?;
    
    Ok(new_state)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, create_overlay_window, toggle_condensed_mode])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
