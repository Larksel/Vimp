import Module from "./BaseModule";
import type Store from 'electron-store';
import { Config } from "../../shared/types/vimp";
import chokidar from 'chokidar';

export default class FileWatcher extends Module {
  protected config: Store<Config>;

  constructor(config: Store<Config>) {
    super();

    this.config = config;
  }

  async load() {
    const watcher = chokidar.watch(this.config.get('musicFolders'), {
      persistent: true,
      awaitWriteFinish: true,
    })
    
    // TODO verificar se ja existe no banco. Se não existir, adicione
    // TODO como saber se um arquivo foi movido ou renomeado?
    // TODO onde ficarão os handlers para esses casos?
    // TODO ignorar arquivos desconhecidos
    watcher
      .on('add', path => console.log(`File ${path} has been added`))
      .on('change', path => console.log(`File ${path} has been changed`))
      .on('unlink', path => console.log(`File ${path} has been removed`))
      .on('error', error => console.log(`Watcher error ${error}`))
      .on('ready', () => console.log('Initial scan complete. Ready for changes.'));
  }
}