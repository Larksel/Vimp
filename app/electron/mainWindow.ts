import { BrowserWindow, Menu, ipcMain } from 'electron';


declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

const menu = Menu.buildFromTemplate([
  {
    label: 'Abrir DevTools',
    role: 'toggleDevTools'
  },
  {
    label: 'Recarregar',
    role: 'reload'
  },
  {
    label: 'Recarregamento Forçado',
    role: 'forceReload'
  },
  { type: 'separator' },
  {
    label: 'Sair',
    role: 'quit'
  },
])

let mainWindow: BrowserWindow;

const createWindow = (): void => {
  //#region window setup
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 670,
    minWidth: 940,
    minHeight: 560,
    backgroundColor: '#000000',
    frame: false,
    show: false,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      contextIsolation: true,
      nodeIntegration: false,
      devTools: true
    },
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  
  mainWindow.webContents.on('context-menu', () => {
    menu.popup({ window: mainWindow })
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })
  //#endregion

  //#region ipcMain section
  ipcMain.on('minimizeApp', () => {
    mainWindow.minimize()
  })

  ipcMain.on('maximizeOrRestoreApp', () => {
    if (mainWindow.isMaximized()) {
      mainWindow.restore()
    } else {
      mainWindow.maximize()
    }
  })

  ipcMain.on('closeApp', () => {
    mainWindow.close()
  })
  //#endregion
};

export default createWindow;