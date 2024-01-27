import { ipcMain } from 'electron';
import { getCover } from './metadataHandler';

export default function setupIPCTracks() {
  ipcMain.handle('getCover', async (_, trackPath: string) => {
    return getCover(trackPath)
  })
}