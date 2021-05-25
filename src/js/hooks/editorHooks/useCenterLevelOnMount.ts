import { useEffect, useState } from "react";
import { BoundsRect, LevelElements } from "../../types";
import {
  getBoundsRect,
  getLevelsBounds,
  getLevelBounds,
} from "../../utils/shapeUtils";

type Props = {
  level: LevelElements | LevelElements[];
  stageWidth: number;
  stageHeight: number;
  fitBoundsRect: (rect: BoundsRect) => void;
};

const useCenterLevelOnMount = ({
  stageWidth,
  stageHeight,
  level,
  fitBoundsRect,
}: Props): void => {
  const [mountedStage, setMountedStage] = useState(false);
  useEffect(
    function centerLevelOnMount() {
      const visibleStage = stageWidth > 0 && stageHeight > 0;
      if (!mountedStage && visibleStage) {
        const levelBounds = Array.isArray(level)
          ? getLevelsBounds(level)
          : getLevelBounds(level);
        const levelBoundsRect = getBoundsRect(levelBounds);
        fitBoundsRect({
          ...levelBoundsRect,
          x: -levelBoundsRect.x,
          y: -levelBoundsRect.y,
        });
        setMountedStage(true);
      }
    },
    [stageWidth, stageHeight]
  );
};

export default useCenterLevelOnMount;
