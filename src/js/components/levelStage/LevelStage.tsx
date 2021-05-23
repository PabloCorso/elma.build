import Konva from "konva";
import React, { useState } from "react";
import { Layer } from "react-konva";
import { TemplateBlock } from "../../types";
import EditorStage from "../editorStage";
import { StageZoom } from "../editorStage/EditorStage";
import { ElmaObjectShape, PolygonShape } from "../shapes";

type Props = { blocks: TemplateBlock[]; width: number; height: number };

const LevelStage: React.FC<Props> = ({ blocks, width, height }) => {
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
      <Layer>
        {blocks.map((block) => {
          <>
            {block.polygons.map((polygon, index) => {
              const id = `${block.id}_polygon_${index}`;
              return (
                <PolygonShape
                  key={index}
                  name={id}
                  id={id}
                  polygon={polygon}
                  strokeWidth={1 / stageScale}
                />
              );
            })}
            {block.objects.map((levelObject, index) => {
              const id = `${block.id}_object_${index}`;
              return (
                <ElmaObjectShape
                  key={id}
                  id={id}
                  elmaObject={levelObject}
                  strokeWidth={1 / stageScale}
                />
              );
            })}
          </>;
        })}
      </Layer>
    </EditorStage>
  );
};

export default LevelStage;
