import { useEffect, useState } from "react";
import { BoundsRect, PartialLevel } from "../../types";
import {
  getBoundsRect,
  getLevelsBounds,
  getLevelBounds,
  EmptyBounds,
} from "../../utils";

type Props = {
  level: PartialLevel | PartialLevel[];
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
  const [centeredLevel, setCenteredLevel] =
    useState<PartialLevel | PartialLevel[]>();

  const alreadyCenteredBefore = () => {
    return isSameLevelOrLevels(level, centeredLevel);
  };

  useEffect(
    function centerLevelOnMount() {
      const visibleStage = stageWidth > 0 && stageHeight > 0;
      if (visibleStage && !alreadyCenteredBefore()) {
        let levelBounds = EmptyBounds;
        if (level) {
          levelBounds = Array.isArray(level)
            ? getLevelsBounds(level)
            : getLevelBounds(level);
        }
        if (levelBounds) {
          const levelBoundsRect = getBoundsRect(levelBounds);
          fitBoundsRect({
            ...levelBoundsRect,
            x: -levelBoundsRect.x,
            y: -levelBoundsRect.y,
          });
          setCenteredLevel(level);
        }
      }
    },
    [level, stageWidth, stageHeight]
  );
};

const isSameLevel = (level1: PartialLevel, level2: PartialLevel) => {
  return level1 && level2 && level1.name === level2.name;
};

const isSameLevelOrLevels = (
  level1: PartialLevel | PartialLevel[],
  level2: PartialLevel | PartialLevel[]
) => {
  if (Array.isArray(level1) && Array.isArray(level2)) {
    return !level1.some((level, index) => !isSameLevel(level, level2[index]));
  } else if (!Array.isArray(level1) && !Array.isArray(level2)) {
    return isSameLevel(level1, level2);
  }

  return false;
};

export default useCenterLevelOnMount;
