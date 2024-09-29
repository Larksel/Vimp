import os from 'os';
import { join } from "path";

export const reactDevToolsPath = join(
  os.homedir(),
  '/AppData/Local/Google/Chrome/User Data/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/5.3.1_0',
);

const iconPath =
  process.platform === 'win32'
    ? '../../resources/icons/icon.ico'
    : '../../resources/icons/icon.png';

export const vimpIcon = join(__dirname, iconPath);