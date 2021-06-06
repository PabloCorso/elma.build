import {
  BlockElement,
  ElmaObjectBlock,
  ShapeElementType,
  TemplateBlock,
  BoundsRect,
  PolygonBlock,
  LevelBlockElements,
  HandleControlledBlockDrag,
} from "../types";
import { getLevelsBoundsRect, resetLevelElementsPosition } from "./levelUtils";
import { EmptyBoundsRect } from "./shapeUtils";

export const parseBlockElements = (
  blockId: string,
  elements: BlockElement[]
): LevelBlockElements => {
  const polygons: PolygonBlock[] = [];
  const objects: ElmaObjectBlock[] = [];
  for (const element of elements) {
    if (element.type === ShapeElementType.Polygon) {
      const data = element.data as PolygonBlock;
      const polygonId = `${blockId}_polygon_${polygons.length}`;
      const vertices = data.vertices.map((vertex, index) => ({
        id: `${polygonId}_vertex_${index}`,
        ...vertex,
      }));
      polygons.push({
        id: polygonId,
        grass: data.grass,
        vertices,
      });
    } else if (element.type === ShapeElementType.ElmaObject) {
      objects.push({
        id: `${blockId}_object_${objects.length}`,
        ...(element.data as ElmaObjectBlock),
      });
    }
  }

  return resetLevelElementsPosition({ polygons, objects });
};

export const shiftTemplateBlock = (
  templateBlock: TemplateBlock,
  shiftBounds: Partial<BoundsRect>
): TemplateBlock => {
  const shift = {
    ...EmptyBoundsRect,
    ...shiftBounds,
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

export const getTemplateBlockOverlapShift = (
  overlapBlocks: TemplateBlock[]
): BoundsRect => {
  const shiftBounds = getLevelsBoundsRect(overlapBlocks);
  const marginRight = overlapBlocks.length === 0 ? 0 : 10;
  const shift: BoundsRect = {
    ...EmptyBoundsRect,
    x: shiftBounds.x,
    width: shiftBounds.width + marginRight,
  };
  return shift;
};

export const createTemplateBlock = (
  blockElements: BlockElement[],
  blockIndex = 0
): TemplateBlock => {
  const blockId = `block_${blockIndex}`;
  const newBlock: TemplateBlock = {
    id: blockId,
    name: `Block ${blockIndex + 1}`,
    ...parseBlockElements(blockId, blockElements),
  };
  return newBlock;
};

export const handleControlledBlockDrag = ({
  block,
  event,
  move,
}: HandleControlledBlockDrag): void => {
  const shift = {
    x: block.origin.x + event.target.x(),
    y: block.origin.y + event.target.y(),
  };
  // Reset the internal position first.
  // Because Konva edits the position internally
  // on drag and we end up moving x and y twice.
  event.target.position({ x: 0, y: 0 });
  move(block.instance, shift);
};
