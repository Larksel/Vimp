import { ipcMain } from 'electron';
import { readFile } from 'fs/promises';
import BaseModule from './BaseModule';
import IPCChannels from '@shared/constants/IPCChannels';
import { createMainLogger } from '@main/logger';

const logger = createMainLogger('FileSystem');

export default class FileSystemModule extends BaseModule {
  constructor() {
    super();
  }

  protected async load() {
    ipcMain.handle(IPCChannels.LOAD_AUDIO_FILE, (_, filePath: string) => {
      return this.loadAudioFile(filePath);
    });
  }

  async loadAudioFile(filePath: string): Promise<ArrayBuffer> {
    try {
      const nodeBuffer = await readFile(filePath);
      const arrayBuffer = nodeBuffer.buffer.slice(
        nodeBuffer.byteOffset,
        nodeBuffer.byteOffset + nodeBuffer.byteLength,
      );

      return arrayBuffer as ArrayBuffer;
    } catch (error) {
      logger.error(`Failed to read audio file ${filePath}: ${error}`);
      throw new Error(`Could not load audio file: ${filePath}`);
    }
  }
}
