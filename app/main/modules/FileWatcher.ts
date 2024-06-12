import type Store from 'electron-store';
import chokidar from 'chokidar';
import path from 'path';
import Module from './BaseModule';
import { Config } from '../../shared/types/vimp';
import globals from '../../shared/lib/globals';

export default class FileWatcher extends Module {
  protected config: Store<Config>;

  constructor(config: Store<Config>) {
    super();

    this.config = config;
  }

  async load() {
    const filesToWatch = this.getFilesToWatch();
    const watcher = chokidar.watch(filesToWatch, {
      persistent: true,
      awaitWriteFinish: true,
    });
    // TODO eu deveria apenas verificar ao iniciar e em resposta a um input do usuario?

    // TODO verificar se ja existe no banco. Se não existir, adicione
    // TODO como saber se um arquivo foi movido ou renomeado?
    // TODO onde ficarão os handlers para esses casos?
    watcher
      .on('add', (path) => console.log(`File ${path} has been added`))
      .on('change', (path) => console.log(`File ${path} has been changed`))
      .on('unlink', (path) => console.log(`File ${path} has been removed`))
      .on('error', (error) => console.log(`Watcher error ${error}`))
      .on('ready', () =>
        console.log('Initial scan complete. Ready for changes.'),
      );
  }

  getFilesToWatch() {
    const musicFolders = this.config.get('musicFolders');
    const normalizedFolders = musicFolders.map((folder) =>
      path.normalize(folder),
    );

    const filesToWatch: string[] = [];
    
    normalizedFolders.map((folder) =>
      globals.SUPPORTED_TRACKS_EXTENSIONS.map((ext) =>
        filesToWatch.push(`${folder}/**/*${ext}`),
      ),
    );

    return filesToWatch;
  }
}
