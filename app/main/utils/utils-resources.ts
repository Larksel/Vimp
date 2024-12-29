import { app } from 'electron';
import os from 'os';
import { join } from 'path';

// Extensions
export const reactDevToolsPath = join(
  os.homedir(),
  '/AppData/Local/Google/Chrome/User Data/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/5.3.1_0',
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
