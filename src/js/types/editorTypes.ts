import Konva from "konva";
import { Point } from "./elmaTypes";
import { BlockElement } from "./templateTypes";

export type Bounds = { x1: number; y1: number; x2: number; y2: number };

export type BoundsRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ShapeNode = Omit<Konva.Node, "attrs"> & {
  attrs: Konva.NodeConfig & {
    selectable?: boolean;
    element?: BlockElement;
  };
};

export type NavigateTo = (point: Point, newScale?: number) => void;

export type ToolbarProps = { fitBoundsRect: (rect: BoundsRect) => void };
