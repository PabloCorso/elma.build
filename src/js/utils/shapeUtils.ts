import Konva from "konva";
import { Bounds, BoundsRect, Point } from "../types";

export const EmptyBounds: Bounds = { x1: 0, y1: 0, x2: 0, y2: 0 };
export const EmptyBoundsRect: BoundsRect = { x: 0, y: 0, width: 0, height: 0 };

export function getRelativePointerPosition(
  node: Konva.Group | Konva.Node
): Point {
  const transform = node.getAbsoluteTransform().copy();
  // to detect relative position we need to invert transform
  transform.invert();

  // get pointer (say mouse or touch) position
  const pos = node.getStage().getPointerPosition();

  // now we can find relative point
  return transform.point(pos);
}

export const getCenter = (p1: Point, p2: Point): Point => {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
  };
};

export const getDistance = (p1: Point, p2: Point): number => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

export const getBoundsRect = ({
  x1,
  y1,
  x2,
  y2,
} = EmptyBounds): BoundsRect => ({
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
