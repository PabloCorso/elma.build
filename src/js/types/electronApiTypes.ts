import { PartialLevel } from "./elmaTypes";
import { Template } from "./templateTypes";

export type SaveLevelProps = {
  filename: string;
  level: PartialLevel;
};

export type ElectronApi = {
  saveLevel: (level: SaveLevelProps) => boolean;
  readAllLevels: () => string[];
  readLevel: (name: string) => PartialLevel;
  saveTemplate: ({ name, blocks }: Template) => boolean;
  readAllTemplates: () => string[];
  readTemplate: (name: string) => Template;
};

export enum ElectronApis {
  SaveLevel = "save-level",
  ReadAllLevels = "read-all-levels",
  ReadLevel = "read-level",
  SaveTemplate = "save-template",
  ReadAllTemplates = "read-all-templates",
  ReadTemplate = "read-template",
}
