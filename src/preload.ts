import { ElectronApis, Template } from "./js/types";
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  readAllLevels: () => ipcRenderer.sendSync(ElectronApis.ReadAllLevels),
  readLevel: (name: string) =>
    JSON.parse(ipcRenderer.sendSync(ElectronApis.ReadLevel, name)),
  saveTemplate: (template: Template) =>
    ipcRenderer.sendSync(ElectronApis.SaveTemplate, JSON.stringify(template)),
  readAllTemplates: () => ipcRenderer.sendSync(ElectronApis.ReadAllTemplates),
  readTemplate: (name: string) =>
    JSON.parse(ipcRenderer.sendSync(ElectronApis.ReadTemplate, name)),
});
