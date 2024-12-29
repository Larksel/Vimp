import { app, ipcMain } from 'electron';
import Store from 'electron-store';
import { Config, RepeatMode } from '@shared/types/vimp';
import BaseModule from './BaseModule';
import IPCChannels from '@shared/constants/IPCChannels';
import { vimpMusicFolder, userMusicFolder } from '@main-utils/utils-resources';
import { IConfigModule } from '@interfaces/modules/IConfigModule';

export default class ConfigModule extends BaseModule implements IConfigModule {
  private readonly config: Store<Config>;

  constructor() {
    super();

    console.log(`Config path:`, app.getPath('userData'));

    this.config = new Store<Config>({
      name: 'config',
      defaults: this.getDefaultConfig(),
    });
  }

  protected async load(): Promise<void> {
    ipcMain.on(IPCChannels.CONFIG_GET_ALL, (event) => {
      event.returnValue = this.config.store;
    });

    ipcMain.handle(IPCChannels.CONFIG_GET_ALL, (): Config => this.config.store);

    ipcMain.handle(IPCChannels.CONFIG_GET, (_, key) => {
      return this.config.get(key);
    });

    ipcMain.handle(IPCChannels.CONFIG_SET, (_, key, value) => {
      this.config.set(key, value);
    });
  }

  /**
   * Returns the current config
   */
  getConfig(): Store<Config> {
    const config = this.config;

    if (config === undefined) {
      throw new Error('Config is not defined');
    }

    return config;
  }

  /**
   * Returns the default config
   */
  private getDefaultConfig(): Config {
    const defaultConfig: Config = {
      audioVolume: 0.5,
      audioPlaybackRate: 1,
      audioMuted: false,
      audioShuffle: false,
      audioRepeatMode: RepeatMode.OFF,
      audioGaplessPlayback: true,
      audioCrossfadeDuration: 300,
      musicFolders: [userMusicFolder, vimpMusicFolder],

      displayNotifications: true,
    };

    return defaultConfig;
  }
}
