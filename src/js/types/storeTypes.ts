import { ElmaObject, Vertex } from "./elmaTypes";
import { TemplateBlock } from "./templateTypes";

export type StoredById<T> = {
  allIds: string[];
  byId: { [key: string]: T };
};

export type StoredByInstance<T> = {
  allInstances: string[];
  byInstance: { [key: string]: T };
};

export type StoredPolygon = {
  grass: boolean;
  vertexIds: string[];
};

export type StoredBlock = {
  name: string;
  polygonIds: string[];
  objectIds: string[];
};

export type StoredLevel = {
  name: string;
  blocks: StoredById<StoredBlock>;
  polygons: StoredById<StoredPolygon>;
  vertices: StoredById<Vertex>;
  objects: StoredById<ElmaObject>;
};

export type Action = {
  type: Actions;
  [key: string]: unknown;
  block?: TemplateBlock;
};

export enum Actions {
  AddTemplateBlock = "store/add_template_block",
}
