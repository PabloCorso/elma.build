import { Level } from "elmajs";
import Konva from "konva";
import { Bounds, BoundsRect } from "../types";

export const getBoundsRect = ({ x1, y1, x2, y2 }: Bounds): BoundsRect => ({
  x: Math.min(x1, x2),
  y: Math.min(y1, y2),
  width: Math.abs(x1 - x2),
  height: Math.abs(y1 - y2),
});

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

export const getLevelBounds = (level: Level): Bounds => {
  let x1;
  let y1;
  let x2;
  let y2;
  for (const polygon of level.polygons) {
    for (const vertex of polygon.vertices) {
      x1 = x1 !== undefined ? Math.min(vertex.x, x1) : vertex.x;
      y1 = y1 !== undefined ? Math.min(vertex.y, y1) : vertex.y;
      x2 = x2 !== undefined ? Math.max(vertex.x, x2) : vertex.x;
      y2 = y2 !== undefined ? Math.max(vertex.y, y2) : vertex.y;
    }
  }

  return { x1, y1, x2, y2 };
};
