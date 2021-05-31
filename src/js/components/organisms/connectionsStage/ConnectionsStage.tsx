import React, { useState } from "react";
import { Group, Layer } from "react-konva";
import {
  EditorStageState,
  useCenterLevelOnMount,
} from "../../../hooks/editorHooks";
import {
  TemplateBlock,
  ConnectionBlock,
  VertexBlockSelection,
} from "../../../types";
import { getConnectionShiftedBlock } from "../../../utils";
import EditorStage from "../editorStage";
import EditorStageContainer from "../../atoms/editorStageContainer";
import VertexShape from "../../molecules/vertexShape";
import ElmaObjectShape from "../../molecules/elmaObjectShape";
import PolygonShape from "../../molecules/polygonShape";

type Props = {
  stageState: EditorStageState<HTMLDivElement>;
  connectionBlocks: ConnectionBlock[];
  templateBlocks: TemplateBlock[];
  createConnection: (
    fromVertex: VertexBlockSelection,
    toVertex: VertexBlockSelection
  ) => void;
};

const ConnectionsStage: React.FC<Props> = ({
  stageState,
  connectionBlocks,
  templateBlocks,
  createConnection,
}) => {
  const { stage, stageContainer, navigateTo, fitBoundsRect } = stageState;

  useCenterLevelOnMount({
    level: templateBlocks,
    stageWidth: stage.width,
    stageHeight: stage.height,
    fitBoundsRect,
  });

  const [selectedVertex, setSelectedVertex] = useState<VertexBlockSelection>();

  const handleClickVertex = (selection: VertexBlockSelection) => {
    const isOtherBlock =
      selectedVertex && selectedVertex.instance !== selection.instance;
    if (isOtherBlock) {
      setSelectedVertex(null);
      createConnection(selectedVertex, selection);
    } else {
      setSelectedVertex(selection);
    }
  };

  const [hoveredBlock, setHoveredBlock] = useState<ConnectionBlock>();
  return (
    <EditorStageContainer
      ref={stageContainer.setRef}
      onKeyDown={stageContainer.onKeyDown}
      onWheel={stageContainer.onWheel}
    >
      <EditorStage {...stage} navigateTo={navigateTo}>
        <Layer>
          {connectionBlocks.map((connectionBlock) => {
            const block = getConnectionShiftedBlock(connectionBlock);
            const instance = connectionBlock.instance;
            return (
              <Group
                key={connectionBlock.instance}
                draggable
                onMouseEnter={() => {
                  setHoveredBlock(connectionBlock);
                }}
                onMouseLeave={() => {
                  setHoveredBlock(null);
                }}
              >
                {block.polygons.map((polygon) => {
                  return (
                    <React.Fragment key={polygon.id}>
                      <PolygonShape
                        name={polygon.id}
                        polygon={polygon}
                        stroke="black"
                        strokeWidth={1 / stage.scale}
                      />
                      {polygon.vertices.map((vertex) => {
                        const isBlockHovered =
                          hoveredBlock && hoveredBlock.instance === instance;
                        const selected =
                          selectedVertex &&
                          selectedVertex.vertex.id === vertex.id &&
                          selectedVertex.instance === instance;
                        return (
                          (isBlockHovered || selected) && (
                            <VertexShape
                              key={vertex.id}
                              radius={5 / stage.scale}
                              strokeWidth={1 / stage.scale}
                              x={vertex.x}
                              y={vertex.y}
                              onClick={() => {
                                handleClickVertex({ vertex, instance });
                              }}
                              selected={selected}
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

export default ConnectionsStage;
