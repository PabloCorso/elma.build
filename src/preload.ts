import { Level } from "elmajs";
import { Block } from "./js/components/app/App";

const { contextBridge, ipcRenderer } = require("electron");

export type Template = { name: string; blocks: Block[] };

export type ElectronApi = {
  readAllLevels: () => string[];
  readLevel: (name: string) => Level;
  saveTemplate: ({ name, blocks }: Template) => boolean;
};

contextBridge.exposeInMainWorld("electron", {
  readAllLevels: () => ipcRenderer.sendSync("read-all-levels"),
  readLevel: (name: string) =>
    JSON.parse(ipcRenderer.sendSync("read-level", name)),
  saveTemplate: (template: Template) =>
    ipcRenderer.sendSync("save-template", JSON.stringify(template)),
});
