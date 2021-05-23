import React, { useState } from "react";
import { Layer, RegularPolygon } from "react-konva";
import Konva from "konva";
import { Level } from "elmajs";
import { LevelShape, PolygonShape } from "../shapes";
import { BlockElement } from "../../types";
import EditorStage, { StageZoom } from "../editorStage/EditorStage";
import "./templateStage.css";

enum ObjectType {
  Exit = 1,
  Apple = 2,
  Killer = 3,
  Start = 4,
}

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

  const handleCreateBlock = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && selectedNodes.length > 0) {
      const blockElements = selectedNodes.map((node) => node.attrs.element);
      setSelectedNodes([]);
      onCreateBlock(blockElements);
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

  return (
    <div
      tabIndex={1}
      className="template-stage-container"
      onKeyDown={handleCreateBlock}
    >
      <EditorStage
        x={stageX}
        y={stageY}
        scaleX={stageScale}
        scaleY={stageScale}
        width={width}
        height={height}
        onWheel={handleWheel}
        onMouseSelect={(_event, nodes) => {
          setSelectedNodes(nodes);
        }}
        onNavigateTo={handleNavigateTo}
        style={{ backgroundColor: "lightgray" }}
      >
        <Layer>
          <LevelShape name={level.name}>
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
                <RegularPolygon
                  key={id}
                  id={id}
                  x={levelObject.position.x}
                  y={levelObject.position.y}
                  radius={0.5}
                  sides={10}
                  stroke={
                    isSelected
                      ? "yellow"
                      : getObjectTypeStroke(levelObject.type)
                  }
                  strokeWidth={1 / stageScale}
                  selectable={true}
                  element={{ type: "level-object", data: levelObject }}
                />
              );
            })}
          </LevelShape>
        </Layer>
      </EditorStage>
    </div>
  );
};

const getObjectTypeStroke = (type: ObjectType) => {
  switch (type) {
    case ObjectType.Apple:
      return "red";
    case ObjectType.Exit:
      return "white";
    case ObjectType.Start:
      return "green";
    case ObjectType.Killer:
    default:
      return "black";
  }
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