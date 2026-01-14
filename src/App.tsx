import { useEffect } from 'react';
import { OmnitrixPlayer } from './components/Player/OmnitrixPlayer';
import { LibraryView } from './components/Library/LibraryView';
import { useAudioStore } from './store/useAudioStore';
import { useTrayIPC } from './hooks/useTrayIPC';

function App() {
  const { loadSettings } = useAudioStore();
  useTrayIPC();

  useEffect(() => {
    console.log("App Mounted. Electron API:", window.electronAPI);
    if (!window.electronAPI) console.error("ELECTRON API MISSING!");
    loadSettings();
  }, []);

  return (
    <div className="w-screen h-screen bg-omni-black flex items-center justify-center overflow-hidden relative text-omni-green">
      {/* Background Particles/Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(5,242,25,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(5,242,25,0.03)_1px,transparent_1px)] bg-[size:40px_40px] z-0 pointer-events-none" />

      {/* Window Controls (Custom) */}
      <div className="absolute top-0 left-0 w-full h-8 flex justify-between items-center px-4 bg-omni-dark/80 backdrop-blur-md z-50 drag-region border-b border-omni-green/20">
        <div className="text-xs font-bold tracking-widest text-omni-green/70">OMNIBEATS // v1.0</div>
        <div className="flex gap-2 no-drag-region">
          <button onClick={() => window.electronAPI?.minimize()} className="hover:text-white transition-colors">-</button>
          <button onClick={() => window.electronAPI?.maximize()} className="hover:text-white transition-colors">□</button>
          <button onClick={() => window.electronAPI?.close()} className="hover:text-red-500 transition-colors">×</button>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 w-full max-w-5xl h-[calc(100vh-32px)] mt-8 flex gap-4 p-4">

        {/* Left Panel: Library */}
        <div className="w-1/3 h-full glass-panel rounded-lg p-4 flex flex-col overflow-hidden">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="w-2 h-6 bg-omni-green block"></span> LIBRARY
          </h2>
          <LibraryView />
        </div>

        {/* Center/Right Panel: Player */}
        <div className="flex-1 h-full glass-panel rounded-lg p-6 flex flex-col items-center justify-center relative bg-omni-black/40 overflow-hidden">
          <OmnitrixPlayer />
        </div>

      </main>

    </div>
  );
}

export default App;
