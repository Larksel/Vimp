import { app, session } from 'electron';
import { electronApp, optimizer } from '@electron-toolkit/utils';
import log from 'electron-log/main';
// Modules
import * as ModulesManager from '@main-utils/utils-modules';
import AppMenuModule from '@modules/AppMenuModule';
import ConfigModule from '@modules/ConfigModule';
import DialogsModule from '@modules/DialogsModule';
import LibraryModule from '@modules/LibraryModule';
import MainWindowModule from '@modules/MainWindowModule';
import MetadataModule from '@modules/MetadataModule';
import ProtocolModule from '@modules/ProtocolModule';
import WatcherModule from '@modules/WatcherModule';
// IPC Modules
import IPCTracksDatabase from '@modules/ipc/IPCTracksDatabase';
import IPCPlaylistsDatabase from '@modules/ipc/IPCPlaylistsDatabase';
import { reactDevToolsPath } from '@main-utils/utils-resources';
import DBManager from './dbManager';
import setupLogger from './logger';

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

setupLogger(isDebug);

log.info('[Main] Initializing Vimp');
log.info('[Main] Debug:', isDebug);
log.info('[Main] Platform:', process.platform, '\n\n');

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.whenReady().then(async () => {
  electronApp.setAppUserModelId('com.electron.vimp');

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  if (isDebug) {
    await session.defaultSession
      .loadExtension(reactDevToolsPath)
      .then((ext) => log.info('[Main] Loaded Extension:', ext.name))
      .catch((err) => log.warn('[Main] Error on extension loading:', err));
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
    new ProtocolModule(),
    new AppMenuModule(mainWindow!),
    new WatcherModule(dbManager, config, metadataModule),
    // IPC Modules
    new IPCTracksDatabase(dbManager),
    new IPCPlaylistsDatabase(dbManager),
  );
});
