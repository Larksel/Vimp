import { app, BrowserWindow } from 'electron';
import { electronApp, optimizer } from '@electron-toolkit/utils';
import { join } from 'path';
import MenuBuilder from './modules/MenuBuilder';
import { setupVimpProtocol } from './modules/Protocol';
import setupIPCDatabase from './modules/IPCDatabase';
import setupIPCTracks from './modules/IPCTracks';
import setupIPCDialog from './modules/Dialog';
import Library from './modules/Library';

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

const iconPath =
  process.platform === 'win32'
    ? '../../resources/icons/icon.ico'
    : '../../resources/icons/icon.png';

const icon = join(__dirname, iconPath);
let mainWindow: BrowserWindow | null = null;

console.log('Debug:', isDebug);
console.log('Platform:', process.platform, '\n\n');

const createWindow = () => {
  mainWindow = new BrowserWindow({
    title: 'Vimp',
    width: 1024,
    height: 670,
    minWidth: 940,
    minHeight: 560,
    backgroundColor: 'black',
    frame: false,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: 'black',
      symbolColor: 'white',
      height: 36,
    },
    show: false,
    icon: icon,
    webPreferences: {
      preload: join(__dirname, '../preload/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      devTools: true,
    },
  });

  if (process.argv.includes('--devtools')) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

  mainWindow.webContents.setWindowOpenHandler(() => {
    return { action: 'deny' };
  });

  if (!app.isPackaged && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }

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

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  new MenuBuilder(mainWindow).buildMenu();
};

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron.vimp');

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();

  setupVimpProtocol();
  setupIPCDatabase();
  setupIPCTracks();
  setupIPCDialog();

  new Library().init()
});
