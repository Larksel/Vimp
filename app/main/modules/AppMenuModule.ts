import { Menu, BrowserWindow } from 'electron';
import BaseWindowModule from './BaseWindowModule';

export default class AppMenuModule extends BaseWindowModule {
  constructor(window: BrowserWindow) {
    super(window);
  }

  protected async load() {
    this.buildMenu();
  }

  buildMenu() {
    let menu: Menu;

    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      this.setupDevelopmentEnvironment();
      menu = Menu.buildFromTemplate([
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
    } else {
      menu = Menu.buildFromTemplate([
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
    }

    Menu.setApplicationMenu(menu);
  }

  /**
   * Setup development context menu
   */
  protected setupDevelopmentEnvironment() {
    this.window.webContents.on('context-menu', (_, props) => {
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
            this.window.webContents.inspectElement(x, y);
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
      ]).popup({ window: this.window });
    });
  }
}
