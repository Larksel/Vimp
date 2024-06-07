import Module from "./BaseModule";
import type Store from 'electron-store';
import { Config } from "../../shared/types/vimp";
import chokidar from 'chokidar';
import globals from "../../shared/lib/globals";

const ignoredExtensions = globals.SUPPORTED_TRACKS_EXTENSIONS.map(ext => `**/*${ext}`).map(ext => `!${ext}`);

ignoredExtensions.push('**/*');

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
      ignored: ignoredExtensions
    })
    // TODO fazer o mais facil e depois melhorar

    // TODO eu deveria apenas verificar ao iniciar e em resposta a um input do usuario?
    
    // TODO verificar se ja existe no banco. Se não existir, adicione
    // TODO como saber se um arquivo foi movido ou renomeado?
    // TODO onde ficarão os handlers para esses casos?
    // TODO filtrar para incluir apenas os arquivos suportados (globals.SUPPORTED_TRACKS_EXTENSIONS)
    // TODO ignorar arquivos desconhecidos
    watcher
      .on('add', path => console.log(`File ${path} has been added`))
      .on('change', path => console.log(`File ${path} has been changed`))
      .on('unlink', path => console.log(`File ${path} has been removed`))
      .on('error', error => console.log(`Watcher error ${error}`))
      .on('ready', () => console.log('Initial scan complete. Ready for changes.'));
  }
}