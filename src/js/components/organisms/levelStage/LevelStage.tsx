import React, { useState } from "react";
import Konva from "konva";
import { Group, Layer, Rect } from "react-konva";
import { EditorStageState } from "../../../hooks/editorHooks";
import { LevelBlock, Point, TemplateBlock } from "../../../types";
import EditorStage from "../editorStage";
import EditorStageContainer from "../../atoms/editorStageContainer";
import VertexShape from "../../molecules/vertexShape";
import { getLevelBoundsRect, shiftTemplateBlock } from "../../../utils";
import ElmaObjectShape from "../../molecules/elmaObjectShape";
import PolygonShape from "../../molecules/polygonShape";

type Props = {
  levelBlocks: LevelBlock[];
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

  const [rect, setRect] = useState<unknown>();
  const handleDragMove = (
    block: TemplateBlock,
    event: Konva.KonvaEventObject<DragEvent>
  ) => {
    const shift = {
      x: event.target.x(),
      y: event.target.y(),
    };
    const shiftedBlock = shiftTemplateBlock(block, shift);
    setRect(shiftedBlock);
    for (const polygon of block.polygons) {
      const connection = connectionsById[polygon.id];
      if (connection) {
        for (const vertex of polygon.vertices) {
          const vertexConnection = connection[vertex.id];
          if (vertexConnection) {
            console.log({ vertexConnection });
          }
        }
      }
    }
  };

  const handleDragEnd = (
    levelBlock: LevelBlock,
    event: Konva.KonvaEventObject<DragEvent>
  ) => {
    const shift = {
      x: event.target.x(),
      y: event.target.y(),
    };
    moveLevelBlock(levelBlock.instance, shift);
  };

  return (
    <EditorStageContainer
      ref={stageContainer.setRef}
      onKeyDown={stageContainer.onKeyDown}
      onWheel={stageContainer.onWheel}
    >
      <EditorStage {...stage} navigateTo={navigateTo}>
        <Layer>
          {rect && (
            <Rect
              {...getLevelBoundsRect(rect)}
              stroke="red"
              strokeWidth={1 / stage.scale}
            />
          )}
          {levelBlocks.map((levelBlock, index) => {
            const { block } = levelBlock;
            return (
              <Group
                key={`${block.id}_${index}`}
                draggable
                onDragMove={(event) => {
                  handleDragMove(block, event);
                }}
                onDragEnd={(event) => {
                  handleDragEnd(levelBlock, event);
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
