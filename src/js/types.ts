import {
  ElmaObject as ElmaJSElmaObject,
  Level as ElmaJSLevel,
  Polygon as ElmaJSPolygon,
} from "elmajs";
import Konva from "konva";

export { ObjectType as ElmaObjectType } from "elmajs/lib-esm/lev/ElmaObject";

export type SaveLevelProps = {
  filename: string;
  level: PartialLevel;
};

export type Point = Konva.Vector2d;

export type BlockElementIds = {
  id?: string;
  blockId?: string;
  instance?: string;
};

export type Vertex = BlockElementIds & { polygonId?: string } & Point;

export type Polygon = BlockElementIds &
  Omit<ElmaJSPolygon, "vertices"> & { vertices: Vertex[] };

export type ElmaObject = BlockElementIds & ElmaJSElmaObject;

export type PartialLevel = Partial<
  Omit<ElmaJSLevel, "polygons" | "objects">
> & { polygons: Polygon[]; objects: ElmaObject[] };

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

export enum ShapeElementType {
  ElmaObject = "elma-object",
  Polygon = "polygon",
}

export type LevelElements = { polygons: Polygon[]; objects: ElmaObject[] };

export type BlockElement = {
  type?: ShapeElementType;
  data?: Polygon | ElmaObject;
};

export type TemplateBlock = {
  id: string;
  name: string;
  instance?: string;
} & LevelElements;

export type Template = { name: string; blocks: TemplateBlock[] };

export type VertexConnection = { v1: Vertex; v2: Vertex };

export type Bounds = { x1: number; y1: number; x2: number; y2: number };

export type BoundsRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ShapeNode = Omit<Konva.Node, "attrs"> & {
  attrs: Konva.NodeConfig & {
    selectable?: boolean;
    element?: BlockElement;
  };
};

export type NavigateTo = (point: Point, newScale?: number) => void;

export type ToolbarProps = { fitBoundsRect: (rect: BoundsRect) => void };
