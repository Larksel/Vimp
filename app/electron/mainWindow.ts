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

let mainWindow: BrowserWindow | undefined;

const createWindow = (): void => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 670,
    minWidth: 940,
    minHeight: 560,
    backgroundColor: '#000000',
    frame: false,
    //* show: false,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      contextIsolation: true,
      nodeIntegration: false,
      devTools: true
    },
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  ipcMain.on('minimizeApp', () => {
    mainWindow?.minimize()
  })

  ipcMain.on('maximizeOrRestoreApp', () => {
    if (mainWindow?.isMaximized()) {
      mainWindow.restore()
    } else {
      mainWindow?.maximize()
    }
  })

  ipcMain.on('closeApp', () => {
    mainWindow?.close()
  })

  mainWindow.webContents.on('context-menu', () => {
    menu.popup({ window: mainWindow })
  })

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  /* //* Incluir no pacote se o app iniciar rápido
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })
  */
};

export default createWindow;