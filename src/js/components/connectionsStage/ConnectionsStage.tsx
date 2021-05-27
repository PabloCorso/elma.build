import React from "react";
import { Group, Layer } from "react-konva";
import {
  EditorStageState,
  useCenterLevelOnMount,
} from "../../hooks/editorHooks";
import { TemplateBlock } from "../../types";
import EditorStage from "../editorStage";
import EditorStageContainer from "../editorStageContainer/EditorStageContainer";
import { ElmaObjectShape, PolygonShape } from "../shapes";

type Props = {
  blocks: TemplateBlock[];
  templateBlocks: TemplateBlock[];
  stageState: EditorStageState<HTMLDivElement>;
};

const ConnectionsStage: React.FC<Props> = ({
  blocks,
  templateBlocks,
  stageState,
}) => {
  const { stage, stageContainer, navigateTo, fitBoundsRect } = stageState;

  useCenterLevelOnMount({
    level: templateBlocks,
    stageWidth: stage.width,
    stageHeight: stage.height,
    fitBoundsRect,
  });

  return (
    <EditorStageContainer
      ref={stageContainer.setRef}
      onKeyDown={stageContainer.onKeyDown}
    >
      <EditorStage
        {...stage}
        navigateTo={navigateTo}
        onWheel={stageContainer.onWheel}
        toolbar={toolbar}
      >
        <Layer>
          {blocks.map((block, index) => {
            return (
              <Group key={`${block.name}_${index}`}>
                {block.polygons.map((polygon, index) => {
                  const id = `${block.name}_polygon_${index}`;
                  return (
                    <PolygonShape
                      key={index}
                      name={id}
                      id={id}
                      polygon={polygon}
                      stroke={"black"}
                      strokeWidth={1 / stage.scale}
                    />
                  );
                })}
                {block.objects.map((levelObject, index) => {
                  const id = `${block.name}_object_${index}`;
                  return (
                    <ElmaObjectShape
                      key={id}
                      id={id}
                      elmaObject={levelObject}
                      stroke={"default"}
                      strokeWidth={1 / stage.scale}
                    />
                  );
                })}
              </Group>
            );
          })}
        </Layer>
      </EditorStage>
    </EditorStageContainer>
  );
};

export default ConnectionsStage;
