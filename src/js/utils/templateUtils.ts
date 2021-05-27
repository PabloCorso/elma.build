import { ElmaObject, Polygon } from "elmajs";
import { BlockElement, ShapeElementType } from "../types";
import { resetLevelElementsPosition } from "./levelUtils";

type ParsedBlockElements = { polygons: Polygon[]; objects: ElmaObject[] };

export const parseBlockElements = (
  elements: BlockElement[]
): ParsedBlockElements => {
  const polygons = elements
    .filter((element) => element.type === ShapeElementType.Polygon)
    .map((element) => element.data) as Polygon[];
  const objects = elements
    .filter((element) => element.type === ShapeElementType.ElmaObject)
    .map((element) => element.data) as ElmaObject[];
  return resetLevelElementsPosition({ polygons, objects });
};
