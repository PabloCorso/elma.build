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
  VertexBlockSelection,
  ConnectedBlock,
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
    // origin: { x: shift.x + shift.width, y: shift.y + shift.height },
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

export const addConnection = ({
  connectionBlocks,
  from,
  to,
}: {
  connectionBlocks: ConnectionBlock[];
  from: VertexBlockSelection;
  to: VertexBlockSelection;
}): ConnectionBlock[] => {
  const connections = [];
  for (const connectionBlock of connectionBlocks) {
    const connection = { ...connectionBlock };
    if (connection.instance === from.instance) {
      let connectedBlock: ConnectedBlock = connection.connectedBlocks.find(
        (block) => block.toInstance === to.instance
      );
      const connectedVertex = {
        fromVertex: from.vertex,
        toVertex: to.vertex,
      };
      if (connectedBlock) {
        connectedBlock.connectedVertices.push(connectedVertex);
      } else {
        connectedBlock = {
          toInstance: to.instance,
          connectedVertices: [connectedVertex],
        };
        connection.connectedBlocks.push(connectedBlock);
      }
    } else if (connection.instance === to.instance) {
      let connectedBlock: ConnectedBlock = connection.connectedBlocks.find(
        (block) => block.toInstance === from.instance
      );
      const connectedVertex = {
        fromVertex: to.vertex,
        toVertex: from.vertex,
      };
      if (connectedBlock) {
        connectedBlock.connectedVertices.push(connectedVertex);
      } else {
        connectedBlock = {
          toInstance: from.instance,
          connectedVertices: [connectedVertex],
        };
        connection.connectedBlocks.push(connectedBlock);
      }
    }

    connections.push(connection);
  }

  return connections;
};
