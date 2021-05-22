import React, { useEffect, useState } from "react";
import { Stage, Layer, Rect, RegularPolygon } from "react-konva";
import Konva from "konva";
import { Level } from "elmajs";
import { LevelShape, PolygonShape } from "../shapes";
import { useEventListener } from "../../hooks";
import { BlockElement } from "../../types";

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

type Bounds = { x1: number; y1: number; x2: number; y2: number };

type Props = {
  level: Level;
  width: number;
  height: number;
  onCreateBlock: (elements: BlockElement[]) => void;
};

const LevelEditor: React.FC<Props> = ({
  level,
  width,
  height,
  onCreateBlock,
}) => {
  const [stageScale, setStageScale] = useState(8);
  const [stageX, setStageX] = useState(0);
  const [stageY, setStageY] = useState(0);

  useEffect(
    function onLevelChange() {
      const levelBounds = getLevelBounds(level);
      const levelRect = getBoundsRect(levelBounds);

      const xSign = levelRect.x < 0 ? -1 : 1;
      const ySign = levelRect.y < 0 ? -1 : 1;
      const x = Math.abs(levelRect.x) + levelRect.width + width;
      const y = Math.abs(levelRect.y) + levelRect.height + height;
      setStageX(-x * xSign);
      setStageY(-y * ySign);
    },
    [level]
  );

  const [selectedNodes, setSelectedNodes] = useState<ShapeNode[]>([]);

  const [selectionRectProps, setSelectionRectProps] =
    useState<Konva.RectConfig>({});
  const [selection, setSelection] = useState({
    visible: false,
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
  });

  useEffect(
    function updateSelectionRect() {
      setSelectionRectProps((state) => ({
        ...state,
        visible: selection.visible,
        ...getBoundsRect({ ...selection }),
      }));
    },
    [selection, setSelectionRectProps]
  );

  const onMouseDown = (event: Konva.KonvaEventObject<MouseEvent>) => {
    const isTransformer = event.target.findAncestor("Transformer");
    if (isTransformer) {
      return;
    }

    const pos = getRelativePointerPosition(event.target.getStage());
    setSelection({ visible: true, x1: pos.x, y1: pos.y, x2: pos.x, y2: pos.y });
  };

  const onMouseMove = (event: Konva.KonvaEventObject<MouseEvent>) => {
    if (!selection.visible) {
      return;
    }

    const pos = getRelativePointerPosition(event.target.getStage());
    setSelection((state) => ({ ...state, x2: pos.x, y2: pos.y }));
  };

  const onMouseUp = (event: Konva.KonvaEventObject<MouseEvent>) => {
    if (!selection.visible) {
      return;
    }

    setSelection((state) => ({ ...state, visible: false }));

    const shapes = event.target
      .getStage()
      .find((node: ShapeNode) => node.attrs.selectable)
      .toArray();
    const box = event.target
      .getStage()
      .findOne(".selection-rect")
      .getClientRect();
    const selected = shapes.filter((shape) =>
      Konva.Util.haveIntersection(box, shape.getClientRect())
    ) as ShapeNode[];

    setSelectedNodes(selected);
  };

  const moveStage = (newX: number, newY: number) => {
    setStageX(newX);
    setStageY(newY);
  };

  const translateStage = (x: number, y: number) => {
    moveStage(stageX + x, stageY + y);
  };

  const handleNavigateStage = (event: KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      translateStage(50, 0);
    } else if (event.key === "ArrowRight") {
      translateStage(-50, 0);
    } else if (event.key === "ArrowUp") {
      translateStage(0, 50);
    } else if (event.key === "ArrowDown") {
      translateStage(0, -50);
    }
  };

  const handleCreateBlock = (event: KeyboardEvent) => {
    if (event.key === "Enter" && selectedNodes.length > 0) {
      const blockElements = selectedNodes.map((node) => node.attrs.element);
      setSelectedNodes([]);
      onCreateBlock(blockElements);
    }
  };

  useEventListener("keydown", handleNavigateStage);
  useEventListener("keydown", handleCreateBlock);

  const handleWheel = (event: Konva.KonvaEventObject<WheelEvent>) => {
    event.evt.preventDefault();

    const scaleBy = 1.1;
    const stage = event.target.getStage();
    const oldScale = stage.scaleX();
    const mousePointTo = {
      x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
      y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
    };

    const newScale =
      event.evt.deltaY <= 0 ? oldScale * scaleBy : oldScale / scaleBy;

    setStageScale(newScale);
    setStageX(
      -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale
    );
    setStageY(
      -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale
    );
  };

  return (
    <div>
      <Stage
        className="stage"
        onWheel={handleWheel}
        scaleX={stageScale}
        scaleY={stageScale}
        x={stageX}
        y={stageY}
        width={width}
        height={height}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
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
          <Rect
            stroke="blue"
            strokeWidth={1 / stageScale}
            name="selection-rect"
            {...selectionRectProps}
          />
        </Layer>
      </Stage>
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

const getLevelBounds = (level: Level): Bounds => {
  let x1;
  let y1;
  let x2;
  let y2;
  for (const polygon of level.polygons) {
    for (const vertex of polygon.vertices) {
      x1 = x1 !== undefined ? Math.min(vertex.x, x1) : vertex.x;
      y1 = y1 !== undefined ? Math.min(vertex.y, y1) : vertex.y;
      x2 = x2 !== undefined ? Math.max(vertex.x, x2) : vertex.x;
      y2 = y2 !== undefined ? Math.max(vertex.y, y2) : vertex.y;
    }
  }

  return { x1, y1, x2, y2 };
};

const getBoundsRect = ({ x1, y1, x2, y2 }: Bounds) => ({
  x: Math.min(x1, x2),
  y: Math.min(y1, y2),
  width: Math.abs(x1 - x2),
  height: Math.abs(y1 - y2),
});

function getRelativePointerPosition(node: Konva.Group) {
  const transform = node.getAbsoluteTransform().copy();
  // to detect relative position we need to invert transform
  transform.invert();

  // get pointer (say mouse or touch) position
  const pos = node.getStage().getPointerPosition();

  // now we can find relative point
  return transform.point(pos);
}

// function getCenter(p1: Konva.Vector2d, p2: Konva.Vector2d) {
//   return {
//     x: (p1.x + p2.x) / 2,
//     y: (p1.y + p2.y) / 2,
//   };
// }

// function getDistance(p1: Konva.Vector2d, p2: Konva.Vector2d) {
//   return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
// }

export default LevelEditor;
