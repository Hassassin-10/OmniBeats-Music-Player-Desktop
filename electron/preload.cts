import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    minimize: () => ipcRenderer.invoke('minimize-window'),
    maximize: () => ipcRenderer.invoke('maximize-window'),
    close: () => ipcRenderer.invoke('close-window'),
    selectFolder: () => ipcRenderer.invoke('select-folder'),
    scanFolder: (path: string) => ipcRenderer.invoke('scan-folder', path),
    getStoreValue: (key: string) => ipcRenderer.invoke('get-store-value', key),
    setStoreValue: (key: string, value: any) => ipcRenderer.invoke('set-store-value', key, value),
    onTrayCommand: (callback: (command: string) => void) => {
        const listener = (_: any, cmd: string) => callback(cmd);
        ipcRenderer.on('tray-command', listener);
        return () => ipcRenderer.removeListener('tray-command', listener);
    }
});
