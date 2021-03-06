import React from "react";
import { Group, Layer } from "react-konva";
import { EditorStageState } from "../../../hooks/editorHooks";
import { InstancedBlock, Point } from "../../../types";
import EditorStage from "../editorStage";
import EditorStageContainer from "../../atoms/editorStageContainer";
import VertexShape from "../../molecules/vertexShape";
import ElmaObjectShape from "../../molecules/elmaObjectShape";
import PolygonShape from "../../molecules/polygonShape";
import { handleControlledBlockDrag, shiftTemplateBlock } from "../../../utils";

type Props = {
  levelBlocks: InstancedBlock[];
  stageState: EditorStageState<HTMLDivElement>;
  connectionsById: { [key: string]: { [key: string]: string } };
  moveLevelBlock: (instance: string, point: Point) => void;
};

const LevelStage: React.FC<Props> = ({
  levelBlocks,
  stageState,
  connectionsById,
  moveLevelBlock,
}) => {
  const { stage, stageContainer, navigateTo } = stageState;

  return (
    <EditorStageContainer
      ref={stageContainer.setRef}
      onKeyDown={stageContainer.onKeyDown}
      onWheel={stageContainer.onWheel}
    >
      <EditorStage {...stage} navigateTo={navigateTo}>
        <Layer>
          {levelBlocks.map((levelBlock) => {
            const block = shiftTemplateBlock(
              levelBlock.block,
              levelBlock.origin
            );
            return (
              <Group
                key={levelBlock.instance}
                draggable
                onDragEnd={(event) => {
                  handleControlledBlockDrag({
                    event,
                    block: levelBlock,
                    move: moveLevelBlock,
                  });
                }}
              >
                {block.polygons.map((polygon) => {
                  const verticesById: { [key: string]: string } =
                    connectionsById[polygon.id];
                  return (
                    <React.Fragment key={polygon.id}>
                      <PolygonShape
                        name={polygon.id}
                        polygon={polygon}
                        strokeWidth={1 / stage.scale}
                      />
                      {verticesById &&
                        polygon.vertices.map((vertex) => {
                          return (
                            verticesById[vertex.id] && (
                              <VertexShape
                                key={vertex.id}
                                radius={5 / stage.scale}
                                x={vertex.x}
                                y={vertex.y}
                                strokeWidth={1 / stage.scale}
                              />
                            )
                          );
                        })}
                    </React.Fragment>
                  );
                })}
                {block.objects.map((levelObject) => {
                  return (
                    <ElmaObjectShape
                      key={levelObject.id}
                      elmaObject={levelObject}
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

export default LevelStage;
