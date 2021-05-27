import { ElmaObject, Polygon } from "elmajs";
import { BlockElement, ShapeElementType, TemplateBlock } from "../types";
import { getLevelsBoundsRect, resetLevelElementsPosition } from "./levelUtils";
import { EmptyBoundsRect } from "./shapeUtils";

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

export const shiftTemplateBlock = (
  templateBlock: TemplateBlock,
  overlapBlocks: TemplateBlock[] = []
): TemplateBlock => {
  const shiftBounds = getLevelsBoundsRect(overlapBlocks);
  const marginRight = overlapBlocks.length === 0 ? 0 : 10;
  const shift = {
    ...EmptyBoundsRect,
    x: shiftBounds.x,
    width: shiftBounds.width + marginRight,
  };
  return {
    ...templateBlock,
    ...resetLevelElementsPosition(
      {
        polygons: templateBlock.polygons,
        objects: templateBlock.objects,
      },
      shift
    ),
  };
};
