import Konva from "konva";
import { useState } from "react";
import { BoundsRect, NavigateTo } from "../../types";
import useContainerSize from "./useContainerSize";
import useFitBoundsRect from "./useFitBoundsRect";

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

type StageContainerElement = HTMLElement;

type StageContainer<T extends StageContainerElement> = {
  ref: React.MutableRefObject<T>;
  onWheel: () => void;
} & T;

type UseEditorStageState<T extends StageContainerElement> = {
  stage: EditorStageState;
  stageContainer: StageContainer<T>;
} & EditorStageMethods;

const defaultEditorStageState: Partial<EditorStageState> = {
  x: 0,
  y: 0,
  scale: 8,
};

function useEditorStageState<T extends StageContainerElement>(
  initialValues = defaultEditorStageState
): UseEditorStageState<T> {
  const [scale, setScale] = useState(initialValues.scale);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const { containerRef, containerSize } = useContainerSize<T>();
  const stageContainer = {
    ref: containerRef,
    tabIndex: 1,
    className: "editor-stage-container",
    onWheel: () => {
      if (containerRef.current) {
        containerRef.current.focus();
      }
    },
  } as StageContainer<T>;

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
    stageContainer,
    navigateTo,
    setScale,
    setX,
    setY,
    fitBoundsRect,
  };
}

export default useEditorStageState;
