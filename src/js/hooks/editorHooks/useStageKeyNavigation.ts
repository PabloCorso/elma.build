import { useCallback } from "react";
import { NavigateTo } from "../../types";

type Props = {
  stageX: number;
  stageY: number;
  stageScale: number;
  navigateTo: NavigateTo;
};

function useStageKeyNavigation({
  stageX,
  stageY,
  stageScale,
  navigateTo,
}: Props): (event: React.KeyboardEvent) => void {
  const translateStage = useCallback(
    (translateX: number, translateY: number) => {
      const newStageX = stageX / stageScale + translateX;
      const newStageY = stageY / stageScale + translateY;
      navigateTo({ x: newStageX, y: newStageY }, stageScale);
    },
    [stageX, stageY, stageScale, navigateTo]
  );

  const handleNavigateStage = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        translateStage(50 / stageScale, 0);
      } else if (event.key === "ArrowRight") {
        translateStage(-50 / stageScale, 0);
      } else if (event.key === "ArrowUp") {
        translateStage(0, 50 / stageScale);
      } else if (event.key === "ArrowDown") {
        translateStage(0, -50 / stageScale);
      }
    },
    [stageScale, translateStage]
  );

  return handleNavigateStage;
}

export default useStageKeyNavigation;
