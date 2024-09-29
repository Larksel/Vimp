import { app, BrowserWindow, session } from 'electron';
import { electronApp, optimizer } from '@electron-toolkit/utils';
import os from 'os';
import { join } from 'path';

// Modules
import * as ModulesManager from '@main/utils/utils-modules';
import AppMenuModule from '@modules/AppMenuModule';
import ConfigModule from '@modules/ConfigModule';
import DialogsModule from '@modules/DialogsModule';
import LibraryModule from '@modules/LibraryModule';
import MetadataModule from '@modules/MetadataModule';
import ProtocolModule from '@modules/ProtocolModule';
import WatcherModule from '@modules/WatcherModule';
// IPC Modules
import IPCDatabase from '@modules/ipc/IPCDatabase';

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

const iconPath =
  process.platform === 'win32'
    ? '../../resources/icons/icon.ico'
    : '../../resources/icons/icon.png';

const reactDevToolsPath = join(
  os.homedir(),
  '/AppData/Local/Google/Chrome/User Data/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/5.3.1_0',
);

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
};

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.whenReady().then(async () => {
  electronApp.setAppUserModelId('com.electron.vimp');

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  if (isDebug) {
    await session.defaultSession
      .loadExtension(reactDevToolsPath)
      .then((ext) => console.log('Loaded Extension:', ext.name))
      .catch((err) => console.log('Error on extension loading:', err));
  }

  const configModule = new ConfigModule();
  const metadataModule = new MetadataModule();

  await ModulesManager.init(configModule, metadataModule);
  const config = configModule.getConfig();

  createWindow();

  ModulesManager.init(
    new DialogsModule(metadataModule),
    new LibraryModule(metadataModule),
    new ProtocolModule(),
    new AppMenuModule(mainWindow!),
    new WatcherModule(mainWindow!, config, metadataModule),
    // IPC Modules
    new IPCDatabase(),
  );
});
