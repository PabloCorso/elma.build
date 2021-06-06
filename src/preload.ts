const { contextBridge, ipcRenderer } = require("electron");
const fs = require("fs");
import {
  AppMenuEvents,
  SaveLevelData,
  SaveTemplateData,
  WebContentsChannels,
} from "./js/types";
import { Level } from "elmajs";

const levFolderPath =
  "C:/Users/USER/Documents/Source/elastomania/elma.build/lev";
const templatesFolderPath =
  "C:/Users/USER/Documents/Source/elastomania/elma.build/templates";
const defaultLevelName = "Generated with elma.build";

contextBridge.exposeInMainWorld("electron", {
  saveLevel: ({ filename, level: parsedLevel }: SaveLevelData) => {
    const level = new Level();
    level.name = parsedLevel.name || defaultLevelName;
    level.polygons = parsedLevel.polygons || [];
    level.objects = parsedLevel.objects || [];
    level.ground = parsedLevel.ground || level.ground;
    level.sky = parsedLevel.sky || level.sky;

    fs.writeFileSync(`${levFolderPath}/${filename}.lev`, level.toBuffer());
  },

  readAllLevels: () => {
    return fs.readdirSync(levFolderPath);
  },

  readLevel: (name: string) => {
    const levelFile = fs.readFileSync(`${levFolderPath}/${name}`);
    return Level.from(levelFile);
  },

  readLevelDialog: async () => {
    try {
      const filename = await ipcRenderer.invoke("read-file-dialog");
      const levelFile = fs.readFileSync(filename);
      return Level.from(levelFile);
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  saveTemplate: ({ filename, template }: SaveTemplateData) => {
    fs.writeFileSync(
      `${templatesFolderPath}/${filename}.json`,
      JSON.stringify(template)
    );
  },

  readAllTemplates: () => {
    return fs.readdirSync(templatesFolderPath);
  },

  readTemplate: (filename: string) => {
    const template = fs.readFileSync(
      `${templatesFolderPath}/${filename}`,
      "utf8"
    );
    return JSON.parse(template);
  },
});

ipcRenderer.on(
  WebContentsChannels.AppMenuEvent,
  (_event, appMenuEvent: AppMenuEvents) => {
    const event = new CustomEvent("app-menu", {
      detail: appMenuEvent,
    });
    window.dispatchEvent(event);
  }
);
