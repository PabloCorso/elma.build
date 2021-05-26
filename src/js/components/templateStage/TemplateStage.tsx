import React, { useState } from "react";
import { Layer } from "react-konva";
import Konva from "konva";
import { Level } from "elmajs";
import { ElmaObjectShape, PolygonShape } from "../shapes";
import { BlockElement, ToolbarProps, ShapeNode } from "../../types";
import EditorStage from "../editorStage";
import useEditorStageState, {
  useCenterLevelOnMount,
} from "../../hooks/editorHooks";
import EditorStageContainer from "../editorStageContainer";
import "./templateStage.css";

type Props = {
  level: Level;
  toolbar?: (props: ToolbarProps) => React.ReactNode;
  onCreateBlock: (elements: BlockElement[]) => void;
};

const TemplateEditor: React.FC<Props> = ({ level, toolbar, onCreateBlock }) => {
  const { stage, stageContainer, navigateTo, fitBoundsRect } =
    useEditorStageState<HTMLDivElement>();

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
    <div className="template-stage">
      {toolbar && (
        <div className="template-stage__toolbar">
          {toolbar({ fitBoundsRect })}
        </div>
      )}
      <EditorStageContainer
        {...stageContainer}
        onKeyDown={handleKeyDown}
        className="template-stage__container"
      >
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
    </div>
  );
};

export default TemplateEditor;
