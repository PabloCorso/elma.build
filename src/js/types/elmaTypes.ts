import { Gravity, Level as ElmaJSLevel } from "elmajs";
import { ObjectType as ElmaObjectType } from "elmajs/lib-esm/lev/ElmaObject";
import Konva from "konva";

export type Point = Konva.Vector2d;

export type Vertex = Point;

export type Polygon = { id?: string; grass: boolean; vertices: Vertex[] };

export { ElmaObjectType };

export type ElmaObject = {
  position: Point;
  type: ElmaObjectType;
  gravity: Gravity;
  animation: number;
};

export type LevelElements = { polygons: Polygon[]; objects: ElmaObject[] };

export type PartialLevel = Partial<Omit<ElmaJSLevel, "polygons" | "objects">> &
  LevelElements;
