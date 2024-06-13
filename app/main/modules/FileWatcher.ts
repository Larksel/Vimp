import type Store from 'electron-store';
import chokidar from 'chokidar';
import path from 'path';
import { Config, Track } from '../../shared/types/vimp';
import globals from '../../shared/lib/globals';
import { TracksDB } from '../db';
import { getMetadata } from './Metadata';
import ModuleWindow from './BaseWindowModule';
import { BrowserWindow } from 'electron';
import channels from '../../shared/lib/ipc-channels';

export default class FileWatcher extends ModuleWindow {
  protected config: Store<Config>;

  constructor(window: BrowserWindow, config: Store<Config>) {
    super(window);

    this.config = config;
  }

  async load() {
    const lookahead = globals.SUPPORTED_TRACKS_EXTENSIONS.map(
      (ext) => ext.slice(1) + '$',
    ).join('|'); // Prepara as extensões para o regex
    const watcher = chokidar.watch(this.config.get('musicFolders'), {
      persistent: true,
      awaitWriteFinish: true,
      ignoreInitial: true,
      ignored: new RegExp(`^[^.]*\\.(?!${lookahead})[^.]*$`, 'i'),
    });
    // TODO Verificar ao iniciar

    // TODO como saber se um arquivo foi movido ou renomeado? (Watcher)
    watcher
      .on('add', (path) => this.handleAddedFile(path))
      .on('unlink', (path) => this.handleRemovedFile(path))
      .on('error', (error) => console.log(`Watcher error: ${error}`))
      .on('ready', () => {
        console.log('Initial scan complete. Ready for changes.');
      });
  }

  // TODO definir um intervalo para decidir se irá adicionar um por um ou deixará a library encarregada disso
  async handleAddedFile(filePath: string) {
    console.log(`DETECTED: ${filePath}`);
    const resolvedPath = path.resolve(filePath);

    const existingDoc = await TracksDB.getByPath(resolvedPath);

    if (!existingDoc) {
      const track: Track = await getMetadata(resolvedPath);
      await TracksDB.insertMany([track]);
      console.log(`ADDED: ${filePath}`);

      this.window.webContents.send(channels.TRACKS_DB_CHANGED);
    } else {
      console.log(`SKIPPED: ${filePath}`)
    }
  }

  async handleRemovedFile(filePath: string) {
    console.log(`LOST: ${filePath}`);

    const resolvedPath = path.resolve(filePath);

    const existingDoc = await TracksDB.getByPath(resolvedPath);

    if (existingDoc) {
      await TracksDB.delete(existingDoc._id);
      console.log(`REMOVED: ${filePath}`);

      this.window.webContents.send(channels.TRACKS_DB_CHANGED);
    } else {
      console.log(`Track Not Found: ${filePath}`)
    }
  }
}
