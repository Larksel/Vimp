import { app, BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import BaseModule from './BaseModule';
import { join } from 'path';
import { vimpIcon } from '@main-utils/utils-resources';

export default class MainWindowModule extends BaseModule {
  private window: BrowserWindow | null = null;
  private readonly options?: BrowserWindowConstructorOptions;

  constructor() {
    super();

    this.options = {
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
      icon: vimpIcon,
      webPreferences: {
        preload: join(__dirname, '../preload/preload.js'),
        contextIsolation: true,
        nodeIntegration: false,
        devTools: true,
      },
    };
  }

  protected async load() {
    this.createWindow();
  }

  getWindow() {
    return this.window;
  }

  /**
   * Creates the main window
   */
  private createWindow() {
    this.window = new BrowserWindow(this.options);

    if (process.argv.includes('--devtools')) {
      this.window.webContents.openDevTools({ mode: 'detach' });
    }

    this.window.webContents.setWindowOpenHandler(() => {
      return { action: 'deny' };
    });

    if (!app.isPackaged && process.env['ELECTRON_RENDERER_URL']) {
      this.window.loadURL(process.env['ELECTRON_RENDERER_URL']);
    } else {
      this.window.loadFile(join(__dirname, '../renderer/index.html'));
    }

    this.window.once('ready-to-show', () => {
      if (!this.window) {
        throw new Error('"mainWindow" is not defined');
      }
      if (process.env.START_MINIMIZED) {
        this.window.minimize();
      } else {
        this.window.show();
      }
    });

    this.window.on('closed', () => {
      this.window = null;
    });
  }
}
