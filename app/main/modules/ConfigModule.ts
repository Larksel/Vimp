import { app, ipcMain } from 'electron';
import Store from 'electron-store';
import { Config, RepeatMode } from "../../shared/types/vimp";
import Module from './BaseModule';
import electron from 'electron';
import channels from '../../shared/lib/ipc-channels';

export default class ConfigModule extends Module {
  private workArea: Electron.Rectangle;
  private config: Store<Config>;

  constructor() {
    super();

    console.log(`Config path:`, app.getPath('userData'));

    this.workArea = electron.screen.getPrimaryDisplay().workArea;
    this.config = new Store<Config>({
      name: 'config',
      defaults: this.getDefaultConfig(),
    });
  }

  async load(): Promise<void> {
    ipcMain.on(channels.CONFIG_GET_ALL, (event) => {
      event.returnValue = this.config.store;
    });

    ipcMain.handle(channels.CONFIG_GET_ALL, (): Config => this.config.store);

    ipcMain.handle(channels.CONFIG_GET, (_, key) => {
      return this.config.get(key);
    })

    ipcMain.handle(channels.CONFIG_SET, (_, key, value) => {
      this.config.set(key, value);
    })
  }

  getConfig(): Store<Config> {
    const config = this.config;

    if (config === undefined) {
      throw new Error('Config is not defined')
    }

    return config;
  }

  getDefaultConfig(): Config {
    const defaultConfig: Config = {
      audioVolume: 0.5,
      audioPlaybackRate: 1,
      audioMuted: false,
      audioShuffle: false,
      audioRepeatMode: RepeatMode.OFF,
      audioGaplessPlayback: true,
      audioCrossfadeDuration: 300,
      musicFolders: [app.getPath('music')],
    
      displayNotifications: true,
    
      // bounds: {
      //   width: 1000,
      //   height: 600,
      //   x: Math.round(this.workArea.width / 2),
      //   y: Math.round(this.workArea.height / 2),
      // },
    }

    return defaultConfig;
  }
}