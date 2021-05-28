import React, { useState } from "react";
import { Group, Layer } from "react-konva";
import {
  EditorStageState,
  useCenterLevelOnMount,
} from "../../hooks/editorHooks";
import { Vertex, TemplateBlock, VertexConnection } from "../../types";
import ConnectionShape from "../connectionShape";
import EditorStage from "../editorStage";
import EditorStageContainer from "../editorStageContainer/EditorStageContainer";
import { ElmaObjectShape, PolygonShape } from "../shapes";
import VertexShape from "../vertexShape";

type Props = {
  blocks: TemplateBlock[];
  templateBlocks: TemplateBlock[];
  stageState: EditorStageState<HTMLDivElement>;
  createConnection: (v1: Vertex, v2: Vertex) => void;
  connections?: VertexConnection[];
};

const ConnectionsStage: React.FC<Props> = ({
  blocks,
  templateBlocks,
  stageState,
  connections,
  createConnection,
}) => {
  const { stage, stageContainer, navigateTo, fitBoundsRect } = stageState;

  useCenterLevelOnMount({
    level: templateBlocks,
    stageWidth: stage.width,
    stageHeight: stage.height,
    fitBoundsRect,
  });

  const [selectedVertex, setSelectedVertex] = useState<Vertex>();

  const handleClickVertex = (selection: Vertex) => {
    if (selectedVertex) {
      createConnection(selectedVertex, selection);
      setSelectedVertex(null);
    } else {
      setSelectedVertex(selection);
    }
  };

  const [hoveredBlock, setHoveredBlock] = useState<TemplateBlock>();
  return (
    <EditorStageContainer
      ref={stageContainer.setRef}
      onKeyDown={stageContainer.onKeyDown}
    >
      <EditorStage
        {...stage}
        navigateTo={navigateTo}
        onWheel={stageContainer.onWheel}
      >
        <Layer>
          {blocks.map((block) => {
            return (
              <Group
                key={block.instance}
                draggable
                onMouseEnter={() => {
                  setHoveredBlock(block);
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
                          hoveredBlock &&
                          hoveredBlock.id === block.id &&
                          hoveredBlock.instance === block.instance;
                        const selected =
                          selectedVertex &&
                          selectedVertex.id === vertex.id &&
                          block.instance === selectedVertex.instance;
                        return (
                          (isBlockHovered || selected) && (
                            <VertexShape
                              key={vertex.id}
                              radius={5 / stage.scale}
                              strokeWidth={1 / stage.scale}
                              x={vertex.x}
                              y={vertex.y}
                              onClick={() => {
                                handleClickVertex({
                                  ...vertex,
                                  instance: block.instance,
                                });
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
                {connections.map((connection) => (
                  <ConnectionShape
                    key={`connection_${connection.v1.id}_${connection.v1.instance}_to_${connection.v2.id}_${connection.v2.instance}`}
                    connection={connection}
                    strokeWidth={1 / stage.scale}
                  />
                ))}
              </Group>
            );
          })}
        </Layer>
      </EditorStage>
    </EditorStageContainer>
  );
};

export default ConnectionsStage;
