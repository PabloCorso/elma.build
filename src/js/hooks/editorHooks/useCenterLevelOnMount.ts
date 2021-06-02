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
  const [mountedStage, setMountedStage] = useState(false);
  useEffect(
    function centerLevelOnMount() {
      const visibleStage = stageWidth > 0 && stageHeight > 0;
      if (!mountedStage && visibleStage) {
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
          setMountedStage(true);
        }
      }
    },
    [stageWidth, stageHeight]
  );
};

export default useCenterLevelOnMount;
