import IPCChannels from "@shared/constants/IPCChannels";
import { Config } from "@shared/types/vimp";
import { ipcRenderer } from "electron";

const config = {
  __initialConfig: ipcRenderer.sendSync(IPCChannels.CONFIG_GET_ALL),
  getAll(): Promise<Config> {
    return ipcRenderer.invoke(IPCChannels.CONFIG_GET_ALL);
  },
  get<T extends keyof Config>(key: T): Promise<Config[T]> {
    return ipcRenderer.invoke(IPCChannels.CONFIG_GET, key);
  },
  set<T extends keyof Config>(key: T, value: Config[T]): Promise<void> {
    return ipcRenderer.invoke(IPCChannels.CONFIG_SET, key, value);
  },
};

export default config;
