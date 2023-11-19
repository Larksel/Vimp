import { BrowserWindow, Menu } from 'electron';


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
  {type: 'separator'},
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
    backgroundColor: '#000000',
    //* show: false,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });
  
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

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