import { useState } from "react";
import { BoundsRect, NavigateTo, Point } from "../../types";
import useElementDimensions from "react-cool-dimensions";
import useFitBoundsRect from "./useFitBoundsRect";
import useStageKeyNavigation from "./useStageKeyNavigation";

export type EditorStageValues = BoundsRect & {
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

type StageContainer<T extends HTMLDivElement> = {
  setRef: (element?: T) => void;
  onWheel: (event: React.WheelEvent<Element>) => void;
  onKeyDown: (event: React.KeyboardEvent<Element>) => void;
};

export type EditorStageState<T extends HTMLDivElement> = {
  stage: EditorStageValues;
  stageContainer: StageContainer<T>;
} & EditorStageMethods;

const defaultEditorStageState: Partial<EditorStageValues> = {
  x: 0,
  y: 0,
  scale: 8,
};

function useEditorStageState<T extends HTMLDivElement>(
  initialValues = defaultEditorStageState
): EditorStageState<T> {
  const [scale, setScale] = useState(initialValues.scale);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const navigateTo = (point: Point, newScale?: number) => {
    setX(point.x * (newScale || scale));
    setY(point.y * (newScale || scale));

    if (newScale) {
      setScale(newScale);
    }
  };

  const { width, height, entry, observe } = useElementDimensions();
  const containerSize = { width: width || 0, height: height || 0 };

  const keyNavigation = useStageKeyNavigation({
    stageX: x,
    stageY: y,
    stageScale: scale,
    navigateTo,
  });
  const stageContainer = {
    setRef: observe,
    onWheel: () => {
      if (entry && entry.target) {
        (entry.target as T).focus();
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
