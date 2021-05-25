import Konva from "konva";
import { useState } from "react";
import { BoundsRect, NavigateTo } from "../../types";
import useContainerSize from "./useContainerSize";
import useFitBoundsRect from "./useFitBoundsRect";
import useStageKeyNavigation from "./useStageKeyNavigation";

export type EditorStageState = BoundsRect & {
  x: number;
  y: number;
  scale: number;
};

type EditorStageMethods = {
  navigateTo: NavigateTo;
  setX: React.Dispatch<React.SetStateAction<number>>;
  setY: React.Dispatch<React.SetStateAction<number>>;
  setScale: React.Dispatch<React.SetStateAction<number>>;
  fitBoundsRect: (rect: BoundsRect) => void;
};

type StageContainer<T extends HTMLElement> = {
  ref: React.MutableRefObject<T>;
  onWheel: (event: React.WheelEvent<Element>) => void;
  onKeyDown: (event: React.KeyboardEvent<Element>) => void;
};

type UseEditorStageState<T extends HTMLElement> = {
  stage: EditorStageState;
  stageContainer: StageContainer<T>;
} & EditorStageMethods;

const defaultEditorStageState: Partial<EditorStageState> = {
  x: 0,
  y: 0,
  scale: 8,
};

function useEditorStageState<T extends HTMLElement>(
  initialValues = defaultEditorStageState
): UseEditorStageState<T> {
  const [scale, setScale] = useState(initialValues.scale);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const navigateTo = (point: Konva.Vector2d, newScale?: number) => {
    setX(point.x * (newScale || scale));
    setY(point.y * (newScale || scale));

    if (newScale) {
      setScale(newScale);
    }
  };

  const { containerRef, containerSize } = useContainerSize<T>();
  const keyNavigation = useStageKeyNavigation({
    stageX: x,
    stageY: y,
    stageScale: scale,
    navigateTo,
  });
  const stageContainer = {
    ref: containerRef,
    onWheel: () => {
      if (containerRef.current) {
        containerRef.current.focus();
      }
    },
    onKeyDown: keyNavigation,
  } as StageContainer<T>;

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
    stageContainer,
    navigateTo,
    setScale,
    setX,
    setY,
    fitBoundsRect,
  };
}

export default useEditorStageState;
