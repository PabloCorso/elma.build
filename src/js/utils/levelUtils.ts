import { Bounds, BoundsRect, LevelElements, PartialLevel } from "../types";
import { getBoundsRect, mergeBounds } from "./shapeUtils";

export const getLevelBounds = ({
  polygons = [],
  objects = [],
}: Partial<LevelElements>): Bounds => {
  let x1, y1;
  let x2, y2;
  for (const polygon of polygons) {
    for (const vertex of polygon.vertices) {
      x1 = x1 !== undefined ? Math.min(vertex.x, x1) : vertex.x;
      y1 = y1 !== undefined ? Math.min(vertex.y, y1) : vertex.y;
      x2 = x2 !== undefined ? Math.max(vertex.x, x2) : vertex.x;
      y2 = y2 !== undefined ? Math.max(vertex.y, y2) : vertex.y;
    }
  }

  for (const object of objects) {
    const vertex = object.position;
    x1 = x1 !== undefined ? Math.min(vertex.x, x1) : vertex.x;
    y1 = y1 !== undefined ? Math.min(vertex.y, y1) : vertex.y;
    x2 = x2 !== undefined ? Math.max(vertex.x, x2) : vertex.x;
    y2 = y2 !== undefined ? Math.max(vertex.y, y2) : vertex.y;
  }

  return { x1, y1, x2, y2 };
};

export const getLevelsBounds = (levels: Partial<LevelElements>[]): Bounds => {
  let result: Bounds;
  for (const level of levels) {
    const levelBounds = getLevelBounds(level);
    result = result ? mergeBounds(levelBounds, result) : levelBounds;
  }

  return result;
};

export const getLevelBoundsRect = (
  level: Partial<LevelElements>
): BoundsRect => {
  const levelBounds = getLevelBounds(level);
  return getBoundsRect(levelBounds);
};

export const getLevelsBoundsRect = (
  levels: Partial<LevelElements>[] = []
): BoundsRect => {
  const levelBounds = getLevelsBounds(levels);
  return getBoundsRect(levelBounds);
};

export const resetLevelPosition = (
  level: PartialLevel,
  shift: BoundsRect = { x: 0, y: 0, width: 0, height: 0 }
): PartialLevel => {
  const levelBoundsRect = getLevelBoundsRect(level);
  const xReset = levelBoundsRect.x * -1;
  const yReset = levelBoundsRect.y * -1;

  const resetPosition = ({ x, y }: { x: number; y: number }) => ({
    x: x + xReset + shift.x + shift.width,
    y: y + yReset + shift.y + shift.height,
  });

  const polygons = level.polygons.map((polygon) => ({
    ...polygon,
    vertices: polygon.vertices.map((vertex) => ({
      ...vertex,
      ...resetPosition(vertex),
    })),
  }));
  const objects = level.objects.map((elmaObject) => ({
    ...elmaObject,
    position: resetPosition(elmaObject.position),
  }));
  return { ...level, polygons, objects };
};

export const resetLevelElementsPosition = (
  elements: LevelElements,
  shift?: BoundsRect
): LevelElements => resetLevelPosition(elements, shift) as LevelElements;
