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
  saveLevel: (data: SaveLevelData) => boolean;
  readAllLevels: () => string[];
  readLevel: (name: string) => PartialLevel;
  saveTemplate: (data: SaveTemplateData) => boolean;
  readAllTemplates: () => string[];
  readTemplate: (filename: string) => StoredTemplate;
};

export enum ElectronApis {
  SaveLevel = "save-level",
  ReadAllLevels = "read-all-levels",
  ReadLevel = "read-level",
  SaveTemplate = "save-template",
  ReadAllTemplates = "read-all-templates",
  ReadTemplate = "read-template",
}
