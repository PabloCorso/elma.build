import React, { useCallback } from "react";
import Konva from "konva";
import { Layer, Stage, StageProps } from "react-konva";
import { NavigateTo } from "../../../types";
import { LineAxis } from "../../molecules/helperShapes";

type Props = Omit<StageProps, "scale"> & {
  scale: number;
  navigateTo: NavigateTo;
};

const EditorStage: React.FC<Props> = ({
  x: stageX,
  y: stageY,
  scale: stageScale,
  width: stageWidth,
  height: stageHeight,
  children,
  style,
  navigateTo,
  onWheel,
  ...stageProps
}) => {
  const handleWheel = useCallback(
    (event: Konva.KonvaEventObject<WheelEvent>) => {
      event.evt.preventDefault();

      const scaleBy = 1.125;
      const stage = event.target.getStage();
      const oldScale = stage.scaleX();
      const mousePointTo = {
        x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
        y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
      };

      const newScale =
        event.evt.deltaY <= 0 ? oldScale * scaleBy : oldScale / scaleBy;
      const newStageX = -(
        mousePointTo.x -
        stage.getPointerPosition().x / newScale
      );
      const newStageY = -(
        mousePointTo.y -
        stage.getPointerPosition().y / newScale
      );

      navigateTo({ x: newStageX, y: newStageY }, newScale);

      onWheel && onWheel(event);
    },
    [navigateTo, onWheel]
  );

  return (
    <Stage
      width={stageWidth}
      height={stageHeight}
      x={stageX}
      y={stageY}
      scaleX={stageScale}
      scaleY={stageScale}
      onWheel={handleWheel}
      style={{ backgroundColor: "lightgray", ...style }}
      {...stageProps}
    >
      <Layer listening={false}>
        <LineAxis strokeWidth={1 / stageScale} />
      </Layer>
      {children}
    </Stage>
  );
};

export default EditorStage;
