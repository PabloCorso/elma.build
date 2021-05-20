import { Level } from "elmajs";

const { contextBridge, ipcRenderer } = require("electron");

export type ElectronApi = {
  readLevFolderSync: (path: string) => string[];
  readLevelFileSync: (path: string) => Buffer;
  readLevel: (path: string) => Level;
};

contextBridge.exposeInMainWorld("electron", {
  readLevFolderSync: (path: string) =>
    ipcRenderer.sendSync("read-lev-folder-sync", path),
  readLevelFileSync: (path: string) =>
    ipcRenderer.sendSync("read-level-file-sync", path),
  readLevel: (path: string) =>
    JSON.parse(ipcRenderer.sendSync("read-level", path)),
});
