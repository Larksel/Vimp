/* eslint-disable @typescript-eslint/no-var-requires */
import { app, BrowserWindow, Menu, ipcMain, dialog } from 'electron';
import MenuBuilder from './modules/menu';

import { getMetadata } from './modules/metadataHandler';

//TODO Separar código em módulos

declare const VIMP_WEBPACK_ENTRY: string;
declare const VIMP_PRELOAD_WEBPACK_ENTRY: string;

let mainWindow: BrowserWindow | null = null;

if (require('electron-squirrel-startup')) {
  app.quit();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';
console.log('Debug:', isDebug);
console.log('Platform:', process.platform);

/**
 * Prevent default menu from loading
 */
Menu.setApplicationMenu(null);

const createWindow = () => {
  /**
   * Main window configuration
   */
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 670,
    minWidth: 940,
    minHeight: 560,
    backgroundColor: '#000000',
    frame: false,
    show: false,
    webPreferences: {
      preload: VIMP_PRELOAD_WEBPACK_ENTRY,
      contextIsolation: true,
      nodeIntegration: false,
      devTools: true,
    },
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.once('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.loadURL(VIMP_WEBPACK_ENTRY);

  /**
   * mainWindow event listeners
   */

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  ipcMain.on('minimizeApp', () => {
    mainWindow?.minimize();
  });

  ipcMain.on('maximizeOrRestoreApp', () => {
    if (mainWindow?.isMaximized()) {
      mainWindow.restore();
    } else {
      mainWindow?.maximize();
    }
  });

  ipcMain.on('closeApp', () => {
    mainWindow?.close();
  });
};

/**
 * App event listeners
 */

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

/**
 * File picker
 */
ipcMain.handle('pick-files', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['multiSelections', 'openFile'],
    filters: [{ name: 'Audio Files', extensions: ['mp3', 'wav', 'ogg'] }],
  });

  const scanned = await Promise.all(
    result.filePaths.map(async (path) => {
      const track = await getMetadata(path);
      return track;
    })
  );

  return scanned;
});
