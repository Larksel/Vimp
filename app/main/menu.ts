import { Menu, BrowserWindow } from 'electron';

export default class MenuBuilder {
  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  buildMenu() {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      this.setupDevelopmentEnvironment();
      const menu = Menu.buildFromTemplate([
        {
          label: 'Toggle DevTools',
          role: 'toggleDevTools',
          accelerator: 'F12',
        },
        {
          label: 'Tela Cheia',
          role: 'togglefullscreen',
          accelerator: 'F11',
        },
        {
          label: 'Recarregar',
          role: 'reload',
          accelerator: 'F5',
        },
      ]);

      Menu.setApplicationMenu(menu);
    } else {
      const menu = Menu.buildFromTemplate([
        {
          label: 'Recarregar',
          role: 'reload',
          accelerator: 'F5',
        },
        {
          label: 'Tela Cheia',
          role: 'togglefullscreen',
          accelerator: 'F11',
        },
      ]);

      Menu.setApplicationMenu(menu);
    }
  }

  setupDevelopmentEnvironment() {
    this.mainWindow.webContents.on('context-menu', (_, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([
        {
          label: 'Toggle DevTools',
          role: 'toggleDevTools',
          accelerator: 'F12',
        },
        {
          label: 'Inspecionar Elemento',
          click: () => {
            this.mainWindow.webContents.inspectElement(x, y);
          },
          accelerator: 'CommandOrControl+Shift+C',
        },
        {
          label: 'Tela Cheia',
          role: 'togglefullscreen',
          accelerator: 'F11',
        },
        { type: 'separator' },
        {
          label: 'Recarregar',
          role: 'reload',
          accelerator: 'F5',
        },
        {
          label: 'Recarregamento Forçado',
          role: 'forceReload',
          accelerator: 'CommandOrControl+F5',
        },
        { type: 'separator' },
        {
          label: 'Sair',
          role: 'quit',
        },
      ]).popup({ window: this.mainWindow });
    });
  }
}
