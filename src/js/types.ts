import { ElmaObject, Level, Polygon } from "elmajs";

export type ElectronApi = {
  readAllLevels: () => string[];
  readLevel: (name: string) => Level;
  saveTemplate: ({ name, blocks }: Template) => boolean;
  readAllTemplates: () => string[];
  readTemplate: (name: string) => Template;
};

export enum ElectronApis {
  ReadAllLevels = "read-all-levels",
  ReadLevel = "read-level",
  SaveTemplate = "save-template",
  ReadAllTemplates = "read-all-templates",
  ReadTemplate = "read-template",
}

export type BlockElement = {
  type?: "level-object" | "polygon";
  data?: Polygon | ElmaObject;
};

export type TemplateBlock = {
  id: string;
  name: string;
  elements: BlockElement[];
};

export type Template = { name: string; blocks: TemplateBlock[] };
