import { app, session } from 'electron';
import { electronApp, optimizer } from '@electron-toolkit/utils';
import setupLogger, { createMainLogger } from './logger';
// Modules
import * as ModulesManager from '@main-utils/utils-modules';
import AppMenuModule from '@modules/AppMenuModule';
import ConfigModule from '@modules/ConfigModule';
import DialogsModule from '@modules/DialogsModule';
import FileSystemModule from '@modules/FileSystemModule';
import LibraryModule from '@modules/LibraryModule';
import MainWindowModule from '@modules/MainWindowModule';
import MetadataModule from '@modules/MetadataModule';
import WatcherModule from '@modules/WatcherModule';
// IPC Modules
import IPCTracksDatabase from '@modules/ipc/IPCTracksDatabase';
import IPCPlaylistsDatabase from '@modules/ipc/IPCPlaylistsDatabase';
import { reactDevToolsPath } from '@main-utils/utils-resources';
import DBManager from './dbManager';

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

setupLogger(isDebug);
const logger = createMainLogger('Main');

logger.info(`Initializing Vimp`);
logger.info(`Debug: ${isDebug}`);
logger.info(`Platform: ${process.platform}\n\n`);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.whenReady().then(async () => {
  electronApp.setAppUserModelId('com.larksel.vimp');

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  if (isDebug) {
    await session.defaultSession.extensions
      .loadExtension(reactDevToolsPath)
      .then((ext) => logger.info(`Loaded Extension: ${ext.name}`))
      .catch((err) => logger.warn(`Error on extension loading: ${err}`));
  }

  // Initialize main modules first
  const mainWindowModule = new MainWindowModule();
  const configModule = new ConfigModule();
  const metadataModule = new MetadataModule();

  await ModulesManager.init(mainWindowModule, configModule, metadataModule);
  const mainWindow = mainWindowModule.getWindow();
  const config = configModule.getConfig();

  // Initialize databases
  const dbManager = new DBManager(mainWindow!);
  await ModulesManager.init(dbManager);

  // Then initialize the rest with their dependencies
  ModulesManager.init(
    new DialogsModule(metadataModule),
    new LibraryModule(dbManager, metadataModule, config),
    new FileSystemModule(),
    new AppMenuModule(mainWindow!),
    new WatcherModule(dbManager, config, metadataModule),
    // IPC Modules
    new IPCTracksDatabase(dbManager),
    new IPCPlaylistsDatabase(dbManager),
  );
});
