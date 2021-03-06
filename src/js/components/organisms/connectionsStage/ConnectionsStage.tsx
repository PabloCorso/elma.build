import React, { useState } from "react";
import { Group, Layer, Line } from "react-konva";
import { EditorStageState } from "../../../hooks/editorHooks";
import {
  ConnectionBlock,
  VertexBlockSelection,
  Point,
  ConnectionEdge,
} from "../../../types";
import EditorStage from "../editorStage";
import EditorStageContainer from "../../atoms/editorStageContainer";
import VertexShape from "../../molecules/vertexShape";
import ElmaObjectShape from "../../molecules/elmaObjectShape";
import PolygonShape from "../../molecules/polygonShape";
import { handleControlledBlockDrag, shiftTemplateBlock } from "../../../utils";

type Props = {
  stageState: EditorStageState<HTMLDivElement>;
  connectionBlocks: ConnectionBlock[];
  connectionEdges: ConnectionEdge[];
  createConnection: (
    fromVertex: VertexBlockSelection,
    toVertex: VertexBlockSelection
  ) => void;
  moveConnectionBlock: (instance: string, origin: Point) => void;
};

const ConnectionsStage: React.FC<Props> = ({
  stageState,
  connectionBlocks,
  connectionEdges,
  createConnection,
  moveConnectionBlock,
}) => {
  const { stage, stageContainer, navigateTo } = stageState;

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
            const { instance } = connectionBlock;
            const block = shiftTemplateBlock(
              connectionBlock.block,
              connectionBlock.origin
            );
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
                onDragEnd={(event) => {
                  handleControlledBlockDrag({
                    event,
                    block: connectionBlock,
                    move: moveConnectionBlock,
                  });
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
          {connectionEdges.map((edge, index) => (
            <Line
              key={`${edge.fromBlock.instance}_${edge.toBlock.instance}_${index}`}
              points={[
                edge.fromVertex.x + edge.fromBlock.origin.x,
                edge.fromVertex.y + edge.fromBlock.origin.y,
                edge.toVertex.x + edge.toBlock.origin.x,
                edge.toVertex.y + edge.toBlock.origin.y,
              ]}
              stroke="green"
              strokeWidth={1 / stage.scale}
              hitStrokeWidth={0}
              shadowForStrokeEnabled={false}
            />
          ))}
        </Layer>
      </EditorStage>
    </EditorStageContainer>
  );
};

export default ConnectionsStage;
