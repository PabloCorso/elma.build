import React, { useState } from "react";
import { Layer } from "react-konva";
import Konva from "konva";
import { Level } from "elmajs";
import { ElmaObjectShape, PolygonShape } from "../shapes";
import { BlockElement } from "../../types";
import EditorStage, { StageZoom } from "../editorStage/EditorStage";
import "./templateStage.css";

type ShapeNode = Konva.Node & {
  attrs: Konva.NodeConfig & {
    selectable?: boolean;
    element?: BlockElement;
  };
};

type Props = {
  level: Level;
  width: number;
  height: number;
  onCreateBlock: (elements: BlockElement[]) => void;
};

const TemplateEditor: React.FC<Props> = ({
  level,
  width,
  height,
  onCreateBlock,
}) => {
  const [stageScale, setStageScale] = useState(8);
  const [stageX, setStageX] = useState(0);
  const [stageY, setStageY] = useState(0);

  // useEffect(
  //   function onLevelChange() {
  //     const levelBounds = getLevelBounds(level);
  //     const levelRect = getBoundsRect(levelBounds);

  //     const xSign = levelRect.x < 0 ? -1 : 1;
  //     const ySign = levelRect.y < 0 ? -1 : 1;
  //     const x = Math.abs(levelRect.x) + levelRect.width + width;
  //     const y = Math.abs(levelRect.y) + levelRect.height + height;
  //     setStageX(-x * xSign);
  //     setStageY(-y * ySign);
  //   },
  //   [level]
  // );

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

  const handleWheel = (
    _event: Konva.KonvaEventObject<WheelEvent>,
    { scale, x, y }: StageZoom
  ) => {
    setStageScale(scale);
    setStageX(x);
    setStageY(y);
  };

  const handleNavigateTo = (x: number, y: number) => {
    setStageX(x);
    setStageY(y);
  };

  const handleMouseSelect = (
    _event: Konva.KonvaEventObject<MouseEvent>,
    nodes: Konva.Node[]
  ) => {
    setSelectedNodes(nodes);
  };

  return (
    <div
      tabIndex={1}
      className="template-stage-container"
      onKeyDown={handleKeyDown}
    >
      <EditorStage
        x={stageX}
        y={stageY}
        scaleX={stageScale}
        scaleY={stageScale}
        width={width}
        height={height}
        onWheel={handleWheel}
        onMouseSelect={handleMouseSelect}
        onNavigateTo={handleNavigateTo}
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
        </Layer>
      </EditorStage>
    </div>
  );
};

// const getLevelBounds = (level: Level): Bounds => {
//   let x1;
//   let y1;
//   let x2;
//   let y2;
//   for (const polygon of level.polygons) {
//     for (const vertex of polygon.vertices) {
//       x1 = x1 !== undefined ? Math.min(vertex.x, x1) : vertex.x;
//       y1 = y1 !== undefined ? Math.min(vertex.y, y1) : vertex.y;
//       x2 = x2 !== undefined ? Math.max(vertex.x, x2) : vertex.x;
//       y2 = y2 !== undefined ? Math.max(vertex.y, y2) : vertex.y;
//     }
//   }

//   return { x1, y1, x2, y2 };
// };

// function getCenter(p1: Konva.Vector2d, p2: Konva.Vector2d) {
//   return {
//     x: (p1.x + p2.x) / 2,
//     y: (p1.y + p2.y) / 2,
//   };
// }

// function getDistance(p1: Konva.Vector2d, p2: Konva.Vector2d) {
//   return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
// }

export default TemplateEditor;
