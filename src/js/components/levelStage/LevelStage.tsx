import React, { useState } from "react";
import Konva from "konva";
import { Group, Layer } from "react-konva";
import {
  EditorStageState,
  useCenterLevelOnMount,
} from "../../hooks/editorHooks";
import { ShapeNode, TemplateBlock } from "../../types";
import EditorStage from "../editorStage";
import EditorStageContainer from "../editorStageContainer/EditorStageContainer";
import { ElmaObjectShape, PolygonShape } from "../shapes";

type Props = {
  blocks: TemplateBlock[];
  templateBlocks: TemplateBlock[];
  stageState: EditorStageState<HTMLDivElement>;
};

const LevelStage: React.FC<Props> = ({
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

  const [selectedNodes, setSelectedNodes] = useState<ShapeNode[]>([]);

  const handleMouseSelect = (
    _event: Konva.KonvaEventObject<MouseEvent>,
    nodes: Konva.Node[]
  ) => {
    setSelectedNodes(nodes);
  };

  return (
    <EditorStageContainer {...stageContainer}>
      <EditorStage
        {...stage}
        navigateTo={navigateTo}
        onMouseSelect={handleMouseSelect}
        onWheel={stageContainer.onWheel}
        toolbar={toolbar}
      >
        <Layer>
          {blocks.map((block, index) => {
            return (
              <Group key={`${block.name}_${index}`}>
                {block.polygons.map((polygon, index) => {
                  const id = `${block.name}_polygon_${index}`;
                  const isSelected = selectedNodes.some(
                    (node) => node.attrs.id === id
                  );
                  return (
                    <PolygonShape
                      key={index}
                      name={id}
                      id={id}
                      polygon={polygon}
                      stroke={isSelected ? "yellow" : "black"}
                      strokeWidth={1 / stage.scale}
                    />
                  );
                })}
                {block.objects.map((levelObject, index) => {
                  const id = `${block.name}_object_${index}`;
                  const isSelected = selectedNodes.some(
                    (node) => node.attrs.id === id
                  );
                  return (
                    <ElmaObjectShape
                      key={id}
                      id={id}
                      elmaObject={levelObject}
                      stroke={isSelected ? "yellow" : "default"}
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
