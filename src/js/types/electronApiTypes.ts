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

  /** Templates */
  saveTemplate: (data: SaveTemplateData) => boolean;
  readTemplate: (filename: string) => StoredTemplate;
  readAllTemplates: () => string[];
};

export enum ElectronApis {
  SaveLevel = "save-level",
  ReadAllLevels = "read-all-levels",
  ReadLevel = "read-level",
  SaveTemplate = "save-template",
  ReadAllTemplates = "read-all-templates",
  ReadTemplate = "read-template",
}

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
