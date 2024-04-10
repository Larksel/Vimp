import { app, BrowserWindow, Menu, ipcMain, dialog, Tray } from 'electron';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import { join } from 'path';
import MenuBuilder from './modules/menu';
import { getMetadata } from './modules/metadataHandler';
import { setupVimpProtocol } from './modules/protocol';
import setupIPCDatabase from './modules/IPCDatabase';
import setupIPCTracks from './modules/IPCTracks';

//TODO Separar código em módulos

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';
console.log('Debug:', isDebug);
console.log('Platform:', process.platform, '\n\n');


const iconPath =
  process.platform === 'win32'
    ? '../../resources/icons/icon.ico'
    : '../../resources/icons/icon.png';

let icon = '';
if (isDebug) {
  icon = join(__dirname, iconPath);
} else {
  icon = iconPath;
}

let mainWindow: BrowserWindow | null = null;

let tray: Tray | null = null;

if (require('electron-squirrel-startup')) {
  app.quit();
}

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
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#000',
      symbolColor: '#fff',
      height: 36
    },
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    icon: icon,
    webPreferences: {
      preload: join(__dirname, '../preload/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      devTools: isDebug,
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

  mainWindow.webContents.setWindowOpenHandler(() => {
    return { action: 'deny' };
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../src/index.html'));
  }

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

  mainWindow.on('resize', () => {
    mainWindow?.webContents.send('window-resized', mainWindow?.isMaximized());
  });
};

/**
 * App event listeners
 */

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    tray = null;
    app.quit();
  }
});

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.vimp.app');

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  })

  createWindow();
  //TODO verificar por que o tray não some junto com o app
  // tray = new Tray(icon);

  setupVimpProtocol();
  setupIPCDatabase();
  setupIPCTracks();

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
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['multiSelections', 'openFile'],
    filters: [{ name: 'Audio Files', extensions: ['mp3', 'wav', 'ogg'] }],
  });

  if (!canceled) {
    const files = await Promise.all(
      filePaths.map(async (path) => {
        const track = await getMetadata(path);
        return track;
      })
    );

    return files;
  }

  return null;
});

ipcMain.handle('open-file', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'Audio Files', extensions: ['mp3', 'wav', 'ogg'] }],
  });

  if (!canceled) {
    const path = filePaths[0];

    const track = await getMetadata(path);
    return track;
  }

  return null;
});
