import { app } from 'electron';
import os from 'os';
import { join } from 'path';

// Extensions
export const reactDevToolsPath = join(
  os.homedir(),
  '/AppData/Local/Google/Chrome/User Data/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/6.1.5_0',
);

// Icon
const iconPath =
  process.platform === 'win32'
    ? '../../resources/icons/icon.ico'
    : '../../resources/icons/icon.png';

export const vimpIcon = join(__dirname, iconPath);

// Folders
export const userFolder = app.getPath('home');
export const userMusicFolder = app.getPath('music');
export const vimpMusicFolder = userFolder + '\\Desktop\\Vimp Music';

export const setupAppDirs = () => {
  if (process.platform === 'linux') {
    const xdgDataHome =
      process.env.XDG_DATA_HOME || join(userFolder, '.local/share');
    const xdgConfigHome =
      process.env.XDG_CONFIG_HOME || join(userFolder, '.config');
    const xdgCacheHome =
      process.env.XDG_CACHE_HOME || join(userFolder, '.cache');

    app.setPath('userData', join(xdgDataHome, 'vimp'));
    app.setPath('appData', join(xdgConfigHome, 'vimp'));
    app.setPath('temp', join(xdgCacheHome, 'vimp'));
    app.setPath('logs', join(xdgDataHome, 'vimp', 'logs'));
  }
};
