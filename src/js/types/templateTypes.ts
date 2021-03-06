import { Polygon, Vertex, ElmaObject, Point } from "./elmaTypes";

export enum ShapeElementType {
  ElmaObject = "elma-object",
  Polygon = "polygon",
}

export type BlockElement = {
  type?: ShapeElementType;
  data?: Polygon | ElmaObject;
};

export type VertexBlock = Vertex & {
  id: string;
};

export type PolygonBlock = Omit<Polygon, "vertices"> & {
  id: string;
  vertices: VertexBlock[];
};

export type ElmaObjectBlock = ElmaObject & { id: string };

export type LevelBlockElements = {
  polygons: PolygonBlock[];
  objects: ElmaObjectBlock[];
};

export type TemplateBlock = {
  id: string;
  name: string;
} & LevelBlockElements;

export type ConnectedVertex = {
  fromVertex: VertexBlock;
  toVertex: VertexBlock;
};

export type ConnectedBlock = {
  toInstance: string;
  connectedVertices: ConnectedVertex[];
};

export type InstancedBlock = {
  block: TemplateBlock;
  instance: string;
  origin: Point;
};

export type ConnectionBlock = InstancedBlock & {
  connectedBlocks: ConnectedBlock[];
};

export type VertexBlockSelection = {
  vertex: VertexBlock;
  instance: string;
};

export type Template = {
  name: string;
  blocks: TemplateBlock[];
  connectionBlocks: ConnectionBlock[];
};
