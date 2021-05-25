import Konva from "konva";
import { useRef, useState } from "react";
import { BoundsRect } from "../types";
import useElementSize from "./useElementSize";

export function useContainerSize<T extends HTMLElement>(): {
  containerRef: React.MutableRefObject<T>;
  containerSize: DOMRect;
} {
  const containerRef = useRef<T>();
  const size = useElementSize(containerRef);
  const width = size ? size.width : 0;
  const height = size ? size.height : 0;
  return { containerRef, containerSize: { ...size, width, height } };
}

export type NavigateTo = (point: Konva.Vector2d, newScale?: number) => void;

type UseFitBoundsRectProps = {
  stageWidth: number;
  stageHeight: number;
  navigateTo: NavigateTo;
};

export function useFitBoundsRect({
  stageWidth,
  stageHeight,
  navigateTo,
}: UseFitBoundsRectProps) {
  return (rect: BoundsRect): void => {
    const padding = 10;
    const rectWidth = rect.width + padding * 2;
    const rectHeight = rect.height + padding * 2;
    const rectX = rect.x + padding;
    const rectY = rect.y + padding;

    const newScaleX = stageWidth / rectWidth;
    const newScaleY = stageHeight / rectHeight;
    const newScale = Math.min(newScaleX, newScaleY);

    const widthDiff = stageWidth / newScale - rectWidth;
    const heightDiff = stageHeight / newScale - rectHeight;
    const newX = widthDiff > heightDiff ? rectX + widthDiff / 2 : rectX;
    const newY = heightDiff > widthDiff ? rectY + heightDiff / 2 : rectY;

    navigateTo({ x: newX, y: newY }, newScale);
  };
}

export type EditorStageState = BoundsRect & {
  x: number;
  y: number;
  scale: number;
};

type EditorStageMethods = {
  navigateTo: (point: Konva.Vector2d, newScale?: number) => void;
  setX: React.Dispatch<React.SetStateAction<number>>;
  setY: React.Dispatch<React.SetStateAction<number>>;
  setScale: React.Dispatch<React.SetStateAction<number>>;
  fitBoundsRect: (rect: BoundsRect) => void;
};

type UseEditorStageState<T extends HTMLElement> = {
  stage: EditorStageState;
  containerRef: React.MutableRefObject<T>;
} & EditorStageMethods;

const defaultEditorStageState: Partial<EditorStageState> = {
  x: 0,
  y: 0,
  scale: 8,
};

export function useEditorStageState<T extends HTMLElement>(
  initialValues = defaultEditorStageState
): UseEditorStageState<T> {
  const [scale, setScale] = useState(initialValues.scale);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const { containerRef, containerSize } = useContainerSize<T>();

  const navigateTo = (point: Konva.Vector2d, newScale?: number) => {
    setX(point.x * (newScale || scale));
    setY(point.y * (newScale || scale));

    if (newScale) {
      setScale(newScale);
    }
  };

  const fitBoundsRect = useFitBoundsRect({
    stageWidth: containerSize.width,
    stageHeight: containerSize.height,
    navigateTo,
  });

  return {
    stage: {
      x,
      y,
      scale,
      width: containerSize.width,
      height: containerSize.height,
    },
    containerRef,
    navigateTo,
    setScale,
    setX,
    setY,
    fitBoundsRect,
  };
}
