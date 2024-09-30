import channels from "@shared/constants/ipc-channels";
import { ipcRenderer } from "electron";

const library = {
  scanTracks: (paths: string[]) =>
    ipcRenderer.invoke(channels.LIBRARY_SCAN_TRACKS, paths),
  importTracks: (paths: string[]) =>
    ipcRenderer.invoke(channels.LIBRARY_IMPORT_TRACKS, paths),
};

export default library;