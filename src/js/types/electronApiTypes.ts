import { PartialLevel } from "./elmaTypes";
import { StoredTemplate } from "./templateStoreTypes";

export type SaveLevelData = {
  filename: string;
  level: PartialLevel;
};

export type SaveTemplateData = {
  filename: string;
  template: StoredTemplate;
};

export type ElectronApi = {
  /** Levels */
  saveLevel: (data: SaveLevelData) => boolean;
  readLevel: (name: string) => PartialLevel;
  readAllLevels: () => string[];
  readLevelDialog: () => Promise<PartialLevel>;

  /** Templates */
  saveTemplate: (data: SaveTemplateData) => boolean;
  readTemplate: (filename: string) => StoredTemplate;
  readAllTemplates: () => string[];
};

export enum WebContentsChannels {
  AppMenuEvent = "web-content/app-menu",
}

export enum AppMenuEvents {
  NewLevel = "app-menu/new-level",
  NewTemplate = "app-menu/new-template",
  OpenLevel = "app-menu/open-level",
  OpenTemplate = "app-menu/open-template",
  Save = "app-menu/save",
  SaveAs = "app-menu/save-as",
  Exit = "app-menu/exit",
}
