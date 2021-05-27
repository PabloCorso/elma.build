import {
  BlockElement,
  Polygon,
  ElmaObject,
  LevelElements,
  ShapeElementType,
  TemplateBlock,
} from "../types";
import { getLevelsBoundsRect, resetLevelElementsPosition } from "./levelUtils";
import { EmptyBoundsRect } from "./shapeUtils";

export const parseBlockElements = (
  blockId: string,
  elements: BlockElement[]
): LevelElements => {
  const polygons: Polygon[] = [];
  const objects: ElmaObject[] = [];
  for (const element of elements) {
    if (element.type === ShapeElementType.Polygon) {
      const data = element.data as Polygon;
      const polygonId = `${blockId}_polygon_${polygons.length}`;
      const vertices = data.vertices.map((vertex, index) => ({
        blockId,
        polygonId,
        id: `${polygonId}_vertex_${index}`,
        ...vertex,
      }));
      polygons.push({
        blockId,
        id: polygonId,
        grass: data.grass,
        vertices,
      });
    } else if (element.type === ShapeElementType.ElmaObject) {
      objects.push({
        blockId,
        id: `${blockId}_object_${objects.length}`,
        ...(element.data as ElmaObject),
      });
    }
  }

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
