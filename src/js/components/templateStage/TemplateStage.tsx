import React, { useEffect, useState } from "react";
import cn from "classnames";
import { Layer } from "react-konva";
import Konva from "konva";
import { Level } from "elmajs";
import { ElmaObjectShape, PolygonShape } from "../shapes";
import { BlockElement, BoundsRect, ShapeNode } from "../../types";
import EditorStage from "../editorStage";
import { getBoundsRect, getLevelBounds } from "../../utils/shapeUtils";
import useEditorStageState from "../../hooks/editorHooks";
import "./templateStage.css";

type ToolbarProps = { fitBoundsRect: (rect: BoundsRect) => void };

type Props = {
  level: Level;
  toolbar?: (props: ToolbarProps) => React.ReactNode;
  onCreateBlock: (elements: BlockElement[]) => void;
};

const TemplateEditor: React.FC<Props> = ({ level, toolbar, onCreateBlock }) => {
  const { stage, stageContainer, navigateTo, fitBoundsRect } =
    useEditorStageState<HTMLDivElement>();

  useEffect(function centerLevelOnInit() {
    const levelBounds = getLevelBounds(level);
    const levelBoundsRect = getBoundsRect(levelBounds);
    console.log({ stage, level, levelBoundsRect });
    fitBoundsRect({
      ...levelBoundsRect,
      x: -levelBoundsRect.x,
      y: -levelBoundsRect.y,
    });
  }, []);

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

  return (
    <div className="template-stage">
      {toolbar && (
        <div className="template-stage__toolbar">
          {toolbar({ fitBoundsRect })}
        </div>
      )}
      <div
        ref={stageContainer.ref}
        onWheel={stageContainer.onWheel}
        tabIndex={stageContainer.tabIndex}
        className={cn("template-stage__container", stageContainer)}
      >
        <EditorStage
          {...stage}
          navigateTo={navigateTo}
          onKeyDown={handleKeyDown}
          onMouseSelect={handleMouseSelect}
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
      </div>
    </div>
  );
};

export default TemplateEditor;
