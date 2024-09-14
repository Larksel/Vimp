import { ipcMain } from 'electron';
import { getCover } from './Metadata';
import channels from '@shared/lib/ipc-channels';

export default function setupIPCTracks() {
  ipcMain.handle(channels.GET_COVER, async (_, trackPath: string) => {
    return getCover(trackPath);
  });
}
