const { contextBridge, ipcRenderer } = require("electron");
import { ElectronApis, Template, SaveLevelProps } from "./js/types";

contextBridge.exposeInMainWorld("electron", {
  saveLevel: (data: SaveLevelProps) =>
    ipcRenderer.sendSync(ElectronApis.SaveLevel, JSON.stringify(data)),
  readAllLevels: () => ipcRenderer.sendSync(ElectronApis.ReadAllLevels),
  readLevel: (name: string) =>
    JSON.parse(ipcRenderer.sendSync(ElectronApis.ReadLevel, name)),
  saveTemplate: (template: Template) =>
    ipcRenderer.sendSync(ElectronApis.SaveTemplate, JSON.stringify(template)),
  readAllTemplates: () => ipcRenderer.sendSync(ElectronApis.ReadAllTemplates),
  readTemplate: (name: string) =>
    JSON.parse(ipcRenderer.sendSync(ElectronApis.ReadTemplate, name)),
});
