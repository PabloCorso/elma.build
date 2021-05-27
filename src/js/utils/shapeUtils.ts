import Konva from "konva";
import { Bounds, BoundsRect, PartialLevel } from "../types";

export function getRelativePointerPosition(
  node: Konva.Group | Konva.Node
): Konva.Vector2d {
  const transform = node.getAbsoluteTransform().copy();
  // to detect relative position we need to invert transform
  transform.invert();

  // get pointer (say mouse or touch) position
  const pos = node.getStage().getPointerPosition();

  // now we can find relative point
  return transform.point(pos);
}

export const getCenter = (
  p1: Konva.Vector2d,
  p2: Konva.Vector2d
): Konva.Vector2d => {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
  };
};

export const getDistance = (p1: Konva.Vector2d, p2: Konva.Vector2d): number => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

export const getBoundsRect = ({ x1, y1, x2, y2 }: Bounds): BoundsRect => ({
  x: Math.min(x1, x2),
  y: Math.min(y1, y2),
  width: Math.abs(x1 - x2),
  height: Math.abs(y1 - y2),
});

export const mergeBounds = (bounds1: Bounds, bounds2: Bounds): Bounds => {
  const result1: { x1: number; y1: number } =
    bounds1.x1 < bounds2.x1 || bounds1.y1 < bounds2.y1 ? bounds1 : bounds2;
  const result2: { x2: number; y2: number } =
    bounds1.x2 > bounds2.x2 || bounds2.y2 > bounds2.y2 ? bounds1 : bounds2;
  return { x1: result1.x1, y1: result1.y1, x2: result2.x2, y2: result2.y2 };
};

export const getLevelBounds = ({ polygons, objects }: PartialLevel): Bounds => {
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

export const getLevelsBounds = (levels: PartialLevel[]): Bounds => {
  let result: Bounds;
  for (const level of levels) {
    const levelBounds = getLevelBounds(level);
    result = result ? mergeBounds(levelBounds, result) : levelBounds;
  }

  return result;
};

export const getLevelBoundsRect = (level: PartialLevel): BoundsRect => {
  const levelBounds = getLevelBounds(level);
  return getBoundsRect(levelBounds);
};

export const getLevelsBoundsRect = (levels: PartialLevel[]): BoundsRect => {
  const levelBounds = getLevelsBounds(levels);
  return getBoundsRect(levelBounds);
};

export const resetLevelPosition = (level: PartialLevel): PartialLevel => {
  const levelBoundsRect = getLevelBoundsRect(level);
  const xReset = levelBoundsRect.x * -1;
  const yReset = levelBoundsRect.y * -1;

  const resetPosition = ({ x, y }: { x: number; y: number }) => ({
    x: x + xReset,
    y: y + yReset,
  });

  const polygons = level.polygons.map((polygon) => ({
    ...polygon,
    vertices: polygon.vertices.map(resetPosition),
  }));
  const objects = level.objects.map((elmaObject) => ({
    ...elmaObject,
    position: resetPosition(elmaObject.position),
  }));
  return { ...level, polygons, objects };
};
