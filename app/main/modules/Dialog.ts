import { ipcMain, dialog } from 'electron';
import { getMetadata } from './Metadata';

import channels from '../../shared/lib/ipc-channels';

//TODO Dialogs genéricos
export default function setupIPCDialog() {
  ipcMain.handle(channels.PICK_FILES, async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['multiSelections', 'openFile'],
      filters: [{ name: 'Audio Files', extensions: ['mp3', 'wav', 'ogg'] }],
    });

    if (!canceled) {
      const files = await Promise.all(
        filePaths.map(async (path) => {
          const track = await getMetadata(path);
          return track;
        }),
      );

      return files;
    }

    return null;
  });

  ipcMain.handle(channels.OPEN_FILE, async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'Audio Files', extensions: ['mp3', 'wav', 'ogg'] }],
    });

    if (!canceled) {
      const path = filePaths[0];

      const track = await getMetadata(path);
      return track;
    }

    return null;
  });
}
