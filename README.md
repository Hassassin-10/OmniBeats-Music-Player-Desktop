# 🟢 OmniBeats // v1.0

> **A futuristic, Ben 10 Omnitrix-inspired music player for Windows.**  
> Built with Electron, React, TypeScript, and Tailwind CSS.

![OmniBeats App](/public/final.png)

## 🚀 Features

*   **⚡ Omnitrix UI**: A custom, fully animated circular player interface with rotating rings and neon glowing effects.
*   **🎧 Robust Audio Core**: Powered by **Howler.js** for high-quality audio playback and state control.
*   **📂 Smart Library**: Automatically scans folders recursively to build your library using `music-metadata`.
*   **📑 Advanced Organization**: Support for **Playlists**, **Favorites**, **Search**, and **Sorting**.
*   **💾 Auto-Persistence**: Remembers your volume, last played track, and library paths (via `electron-store`).
*   **🔔 System Tray**: Control playback (Play/Pause/Next) directly from the Windows system tray.
*   **📊 Visualizer**: Integrated audio visualizer synced to the beat.
*   **🔲 Frameless Design**: Custom glassmorphism window with custom minimize/close controls.

---

## 📂 Project Structure

```bash
c:\H-ASSASSIN\Electron Projects\Music Player\
├── electron/
│   ├── main.ts          # 🧠 Main Process (Window creation, IPC, Tray)
│   ├── preload.ts       # 🌉 Context Bridge (Secure API exposure)
│   └── loaders.ts       # 📂 File System Logic (Scanning & Metadata)
├── src/
│   ├── components/
│   │   ├── Player/      # 💿 OmnitrixPlayer (The Core UI)
│   │   └── Library/     # 📚 LibraryView (Glass Lists)
│   ├── store/           # 📦 State Management (Zustand)
│   ├── styles/          # 🎨 Tailwind & Global CSS
│   └── App.tsx          # ⚛️ Application Entry
├── dist-electron/       # ⚙️ Compiled Main Process
└── release/             # 📦 Final .exe Output
```

---

## 🛠️ Setup Instructions

### Prerequisites
*   **Node.js** (v18 or higher)
*   **NPM** (Active internet connection for dependencies)

### Installation
Clone the project and install dependencies:

```powershell
# Install dependencies
npm install --legacy-peer-deps
```
*(Note: `legacy-peer-deps` is recommended for ensuring React 19 compatibility with some Electron tools)*

### 👨‍💻 Development
Run the React renderer and Electron main process in parallel with hot-reloading:

```powershell
npm run dev
```

---

## 📦 Building for Production

To create the standalone **Windows Installer (`.exe`)**:

```powershell
npm run dist
```

*   **Output Location**: `dist-build/win-unpacked/OmniBeats.exe`
*   *Note: The first build requires internet access to download code-signing tools.*

---

## 🎨 Customization

The design system creates the "Omnitrix" aesthetic using custom Tailwind variables in `tailwind.config.js`:

| Token | Color | Hex |
| :--- | :--- | :--- |
| `omni-green` | Neon Green | `#05F219` |
| `omni-dark` | Deep Green/Black | `#032e18` |
| `omni-black` | True Black | `#000000` |

---

## ⚠️ Developer Notes

*   **IPC Communication**: The app uses `ipcMain` and `ipcRenderer` for all file system operations. No Node.js APIs are exposed directly to the browser view for security.
*   **File Access**: Recursive scanning is optimized but may take a moment for very large libraries (1000+ songs).