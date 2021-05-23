import Konva from "konva";
import React, { useState } from "react";
import { Layer } from "react-konva";
import EditorStage from "../editorStage";
import { StageZoom } from "../editorStage/EditorStage";

type Props = { width: number; height: number };

const LevelStage: React.FC<Props> = ({ width, height }) => {
  const [stageScale, setStageScale] = useState(8);
  const [stageX, setStageX] = useState(0);
  const [stageY, setStageY] = useState(0);

  const handleWheel = (
    _event: Konva.KonvaEventObject<WheelEvent>,
    { scale, x, y }: StageZoom
  ) => {
    setStageScale(scale);
    setStageX(x);
    setStageY(y);
  };

  const handleNavigateTo = (x: number, y: number) => {
    setStageX(x);
    setStageY(y);
  };

  return (
    <EditorStage
      x={stageX}
      y={stageY}
      scaleX={stageScale}
      scaleY={stageScale}
      width={width}
      height={height}
      onWheel={handleWheel}
      onNavigateTo={handleNavigateTo}
    >
      <Layer></Layer>
    </EditorStage>
  );
};

export default LevelStage;
