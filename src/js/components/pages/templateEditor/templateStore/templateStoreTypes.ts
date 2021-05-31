import {
  BlockElement,
  ElmaObject,
  Point,
  TemplateBlock,
  Vertex,
  VertexBlockSelection,
} from "../../../../types";

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

export type StoredConnectedBlock = {
  connectedVertices: StoredById<string>;
};

export type StoreConnectionBlock = {
  blockId: string;
  origin: Point;
  connectedBlocks: StoredByInstance<StoredConnectedBlock>;
};

export type TemplateState = {
  name: string;
  filename: string;
  blocks: StoredById<StoredBlock>;
  polygons: StoredById<StoredPolygon>;
  vertices: StoredById<Vertex>;
  objects: StoredById<ElmaObject>;
  connectionBlocks: StoredByInstance<StoreConnectionBlock>;
};

export enum TemplateActions {
  AddConnection = "template/add_connection",
  AddConnectionBlock = "template/add_connection_block",
  AddTemplateBlock = "template/add_block",
  SetTemplateName = "template/set_name",
  RenameTemplateBlock = "template/rename_block",
}

export type TemplateAction = {
  type: TemplateActions;
  from?: VertexBlockSelection;
  to?: VertexBlockSelection;
  block?: TemplateBlock;
  origin?: Point;
  blockElements?: BlockElement[];
  name?: string;
  blockId?: string;
};
