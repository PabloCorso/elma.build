import { ElmaObject, Level, Polygon } from "elmajs";

export { ObjectType as ElmaObjectType } from "elmajs/lib-esm/lev/ElmaObject";

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

export enum ShapeElementType {
  ElmaObject = "elma-object",
  Polygon = "polygon",
}

export type BlockElement = {
  type?: ShapeElementType;
  data?: Polygon | ElmaObject;
};

export type TemplateBlock = {
  id: string;
  name: string;
  polygons: Polygon[];
  objects: ElmaObject[];
};

export type Template = { name: string; blocks: TemplateBlock[] };

export type Bounds = { x1: number; y1: number; x2: number; y2: number };
