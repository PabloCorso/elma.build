import { Level } from "elmajs";
import { useEffect, useState } from "react";
import { BoundsRect } from "../../types";
import { getBoundsRect, getLevelBounds } from "../../utils/shapeUtils";

type Props = {
  level: Level;
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
        const levelBounds = getLevelBounds(level);
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
