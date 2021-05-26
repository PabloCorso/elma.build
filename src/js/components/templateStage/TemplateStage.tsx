import React, { useState } from "react";
import { Layer } from "react-konva";
import Konva from "konva";
import { Level } from "elmajs";
import { ElmaObjectShape, PolygonShape } from "../shapes";
import { BlockElement, ShapeNode } from "../../types";
import EditorStage from "../editorStage";
import {
  EditorStageState,
  useCenterLevelOnMount,
} from "../../hooks/editorHooks";
import EditorStageContainer from "../editorStageContainer";

type Props = {
  level: Level;
  stageState: EditorStageState<HTMLDivElement>;
  onCreateBlock: (elements: BlockElement[]) => void;
};

const TemplateEditor: React.FC<Props> = ({
  level,
  stageState,
  onCreateBlock,
}) => {
  const { stage, stageContainer, navigateTo, fitBoundsRect } = stageState;
  useCenterLevelOnMount({
    stageWidth: stage.width,
    stageHeight: stage.height,
    level,
    fitBoundsRect,
  });

  const [selectedNodes, setSelectedNodes] = useState<ShapeNode[]>([]);

  const handleCreateBlock = () => {
    if (selectedNodes.length > 0) {
      const blockElements = selectedNodes.map((node) => node.attrs.element);
      setSelectedNodes([]);
      onCreateBlock(blockElements);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (stageContainer && stageContainer.onKeyDown) {
      stageContainer.onKeyDown(event);
    }

    if (event.key === "Enter") {
      handleCreateBlock();
    }
  };

  const handleMouseSelect = (
    _event: Konva.KonvaEventObject<MouseEvent>,
    nodes: Konva.Node[]
  ) => {
    setSelectedNodes(nodes);
  };

  return (
    <EditorStageContainer {...stageContainer} onKeyDown={handleKeyDown}>
      <EditorStage
        {...stage}
        navigateTo={navigateTo}
        onMouseSelect={handleMouseSelect}
        onWheel={stageContainer.onWheel}
        toolbar={toolbar}
      >
        <Layer>
          {level.polygons.map((polygon, index) => {
            const id = `${level.name}_polygon_${index}`;
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
          {level.objects.map((levelObject, index) => {
            const id = `${level.name}_object_${index}`;
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
        </Layer>
      </EditorStage>
    </EditorStageContainer>
  );
};

export default TemplateEditor;
