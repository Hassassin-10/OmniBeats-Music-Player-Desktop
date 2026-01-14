import { Tray, Menu, app, BrowserWindow, nativeImage } from 'electron';
import path from 'path';

let tray: Tray | null = null;

export function createTray(mainWindow: BrowserWindow) {
    // Use a simple icon for now, ideally 'icon.png' or 'tray.png'
    const iconPath = path.join(__dirname, '../public/icon.png');
    // Ensure icon exists or use empty image to avoid error if missing
    const icon = nativeImage.createFromPath(iconPath);

    tray = new Tray(icon);

    const contextMenu = Menu.buildFromTemplate([
        { label: 'Show OmniBeats', click: () => mainWindow.show() },
        { type: 'separator' },
        { label: 'Play / Pause', click: () => mainWindow.webContents.send('tray-play-pause') },
        { label: 'Next Track', click: () => mainWindow.webContents.send('tray-next') },
        { label: 'Previous Track', click: () => mainWindow.webContents.send('tray-prev') },
        { type: 'separator' },
        { label: 'Exit', click: () => app.quit() }
    ]);

    tray.setToolTip('OmniBeats Player');
    tray.setContextMenu(contextMenu);

    tray.on('double-click', () => {
        mainWindow.show();
    });
}
