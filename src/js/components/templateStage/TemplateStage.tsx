import React, { useState } from "react";
import { Layer, Rect } from "react-konva";
import Konva from "konva";
import { Level } from "elmajs";
import { ElmaObjectShape, PolygonShape } from "../shapes";
import { BlockElement, ShapeNode } from "../../types";
import EditorStage, { ToolbarProps } from "../editorStage";
import { getBoundsRect, getLevelBounds } from "../../utils/shapeUtils";
import "./templateStage.css";

type Props = {
  level: Level;
  toolbar?: (props: ToolbarProps) => React.ReactNode;
  onCreateBlock: (elements: BlockElement[]) => void;
};

const TemplateEditor: React.FC<Props> = ({ level, toolbar, onCreateBlock }) => {
  const [selectedNodes, setSelectedNodes] = useState<ShapeNode[]>([]);

  const handleCreateBlock = () => {
    if (selectedNodes.length > 0) {
      const blockElements = selectedNodes.map((node) => node.attrs.element);
      setSelectedNodes([]);
      onCreateBlock(blockElements);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
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

  const levelBounds = getLevelBounds(level);
  const levelBoundsRect = getBoundsRect(levelBounds);

  return (
    <EditorStage
      onKeyDown={handleKeyDown}
      onMouseSelect={handleMouseSelect}
      toolbar={toolbar}
    >
      {({ stageScale }) => (
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
                strokeWidth={1 / stageScale}
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
                strokeWidth={1 / stageScale}
              />
            );
          })}
          <Rect
            {...levelBoundsRect}
            stroke="green"
            strokeWidth={1 / stageScale}
          />
        </Layer>
      )}
    </EditorStage>
  );
};

export default TemplateEditor;
