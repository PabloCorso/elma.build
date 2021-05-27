import React, { useState } from "react";
import { Layer, Rect } from "react-konva";
import { ElmaObjectShape, PolygonShape } from "../shapes";
import { BlockElement, ShapeNode, PartialLevel } from "../../types";
import EditorStage from "../editorStage";
import {
  EditorStageState,
  useCenterLevelOnMount,
  useSelectionRect,
} from "../../hooks/editorHooks";
import EditorStageContainer from "../editorStageContainer";

type Props = {
  level: PartialLevel;
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
      onCreateBlock(blockElements);
      setSelectedNodes([]);
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

  const { selectionRectProps, ...mouseHandlers } = useSelectionRect({
    scale: stage.scale,
    onMouseSelect: (_event, nodes) => {
      setSelectedNodes(nodes);
    },
  });

  return (
    <EditorStageContainer ref={stageContainer.setRef} onKeyDown={handleKeyDown}>
      <EditorStage
        {...stage}
        navigateTo={navigateTo}
        onWheel={stageContainer.onWheel}
        {...mouseHandlers}
      >
        <Layer>
          <Rect {...selectionRectProps} />
        </Layer>
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
