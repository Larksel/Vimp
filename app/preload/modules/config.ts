import channels from "@shared/constants/ipc-channels";
import { Config } from "@shared/types/vimp";
import { ipcRenderer } from "electron";

const config = {
  __initialConfig: ipcRenderer.sendSync(channels.CONFIG_GET_ALL),
  getAll(): Promise<Config> {
    return ipcRenderer.invoke(channels.CONFIG_GET_ALL);
  },
  get<T extends keyof Config>(key: T): Promise<Config[T]> {
    return ipcRenderer.invoke(channels.CONFIG_GET, key);
  },
  set<T extends keyof Config>(key: T, value: Config[T]): Promise<void> {
    return ipcRenderer.invoke(channels.CONFIG_SET, key, value);
  },
};

export default config;
