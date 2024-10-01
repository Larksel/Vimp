import { ipcMain, dialog } from 'electron';
import MetadataModule from './MetadataModule';

import IPCChannels from '@shared/constants/IPCChannels';
import BaseModule from './BaseModule';

export default class DialogsModule extends BaseModule {
  private metadataModule: MetadataModule;

  constructor(metadataModule: MetadataModule) {
    super();

    this.metadataModule = metadataModule;
  }

  protected async load() {
    ipcMain.handle(IPCChannels.PICK_FILES, async () => {
      const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ['multiSelections', 'openFile'],
        filters: [{ name: 'Audio Files', extensions: ['mp3', 'wav', 'ogg'] }],
      });

      if (!canceled) {
        const files = await Promise.all(
          filePaths.map(async (path) => {
            const track = await this.metadataModule.getMetadata(path);
            return track;
          }),
        );

        return files;
      }

      return null;
    });

    ipcMain.handle(IPCChannels.OPEN_FILE, async () => {
      const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'Audio Files', extensions: ['mp3', 'wav', 'ogg'] }],
      });

      if (!canceled) {
        const path = filePaths[0];

        const track = await this.metadataModule.getMetadata(path);
        return track;
      }

      return null;
    });
  }
}
