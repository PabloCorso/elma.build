const { contextBridge, ipcRenderer } = require("electron");
import { ElectronApis, SaveLevelData, SaveTemplateData } from "./js/types";

contextBridge.exposeInMainWorld("electron", {
  saveLevel: (data: SaveLevelData) => {
    return ipcRenderer.sendSync(ElectronApis.SaveLevel, JSON.stringify(data));
  },

  readAllLevels: () => {
    return ipcRenderer.sendSync(ElectronApis.ReadAllLevels);
  },

  readLevel: (name: string) => {
    return JSON.parse(ipcRenderer.sendSync(ElectronApis.ReadLevel, name));
  },

  saveTemplate: (data: SaveTemplateData) => {
    return ipcRenderer.sendSync(
      ElectronApis.SaveTemplate,
      JSON.stringify(data)
    );
  },

  readAllTemplates: () => {
    return ipcRenderer.sendSync(ElectronApis.ReadAllTemplates);
  },

  readTemplate: (filename: string) => {
    return JSON.parse(
      ipcRenderer.sendSync(ElectronApis.ReadTemplate, filename)
    );
  },
});
