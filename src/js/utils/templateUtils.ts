import {
  BlockElement,
  ElmaObjectBlock,
  ShapeElementType,
  TemplateBlock,
  BoundsRect,
  PolygonBlock,
  LevelBlockElements,
  Point,
  ConnectionBlock,
  VertexBlock,
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

const translatePoint = (translate: Point) => (point: Point) => ({
  x: point.x + translate.x,
  y: point.y + translate.y,
});

export const getConnectionShiftedBlock = (
  connectionBlock: ConnectionBlock
): TemplateBlock => {
  const shiftOrigin = translatePoint(connectionBlock.origin);
  const polygons = connectionBlock.block.polygons.map((polygon) => ({
    ...polygon,
    vertices: polygon.vertices.map((vertex) => ({
      ...vertex,
      ...shiftOrigin(vertex),
    })),
  }));
  const objects = connectionBlock.block.objects.map((object) => ({
    ...object,
    position: shiftOrigin(object.position),
  }));
  return { ...connectionBlock.block, polygons, objects };
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

export const shiftTemplateBlockFromOverlap = (
  templateBlock: TemplateBlock,
  overlapBlocks: TemplateBlock[] = []
): TemplateBlock => {
  const shift = getTemplateBlockOverlapShift(overlapBlocks);
  return shiftTemplateBlock(templateBlock, shift);
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

const shiftPoint = (point: Point, shift: Point): Point => ({
  x: point.x + shift.x,
  y: point.y + shift.y,
});

const shiftVertex = (vertex: VertexBlock, shift: Point): VertexBlock => ({
  ...vertex,
  ...shiftPoint(vertex, shift),
});

export const shiftPolygonBlock = (
  polygon: PolygonBlock,
  shift: Point
): PolygonBlock => {
  return {
    ...polygon,
    vertices: polygon.vertices.map((vertex) => shiftVertex(vertex, shift)),
  };
};

export const shiftObjectBlock = (
  object: ElmaObjectBlock,
  shift: Point
): ElmaObjectBlock => ({
  ...object,
  position: shiftPoint(object.position, shift),
});

export const handleControlledBlockDrag = ({
  block,
  event,
  move,
}: HandleControlledBlockDrag): void => {
  const shift = {
    x: event.target.x(),
    y: event.target.y(),
  };
  // To have controlled shapes, we need to update
  // the shape's position to the previous one first.
  // Otherwise Konva updates the position internally,
  // and we end up update the position twice.
  event.target.position(block.origin);
  move(block.instance, shift);
};
