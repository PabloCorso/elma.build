import React, { useEffect, useRef, useState } from "react";
import Konva from "konva";
import { Layer, Rect, Stage, StageProps } from "react-konva";
import { Bounds } from "../../types";
import "./editorStage.css";

export type StageZoom = { scale: number; x: number; y: number };

type Props = Omit<StageProps, "onWheel"> & {
  onKeyDown?: (event: React.KeyboardEvent) => void;
  onWheel?: (
    event: Konva.KonvaEventObject<WheelEvent>,
    newValues: StageZoom
  ) => void;
  onMouseSelect?: (
    event: Konva.KonvaEventObject<MouseEvent>,
    nodes: Konva.Node[]
  ) => void;
  onNavigateTo?: (x: number, y: number) => void;
};

const EditorStage: React.FC<Props> = ({
  x: stageX,
  y: stageY,
  scaleX: stageScaleX,
  scaleY: stageScaleY,
  children,
  style,
  onKeyDown,
  onWheel,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseSelect,
  onNavigateTo,
  ...stageProps
}) => {
  const containerRef = useRef<HTMLDivElement>();

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

  const handleMouseDown = (event: Konva.KonvaEventObject<MouseEvent>) => {
    const isTransformer = event.target.findAncestor("Transformer");
    if (isTransformer) {
      return;
    }

    const pos = getRelativePointerPosition(event.target.getStage());
    setSelection({ visible: true, x1: pos.x, y1: pos.y, x2: pos.x, y2: pos.y });

    onMouseDown && onMouseDown(event);
  };

  const handleMouseMove = (event: Konva.KonvaEventObject<MouseEvent>) => {
    if (!selection.visible) {
      return;
    }

    const pos = getRelativePointerPosition(event.target.getStage());
    setSelection((state) => ({ ...state, x2: pos.x, y2: pos.y }));

    onMouseMove && onMouseMove(event);
  };

  const handleMouseUp = (event: Konva.KonvaEventObject<MouseEvent>) => {
    if (!selection.visible) {
      return;
    }

    setSelection((state) => ({ ...state, visible: false }));

    const shapes = event.target
      .getStage()
      .find((node: Konva.Node) => node.attrs.selectable)
      .toArray();
    const box = event.target
      .getStage()
      .findOne(".selection-rect")
      .getClientRect();
    const selected = shapes.filter((shape) =>
      Konva.Util.haveIntersection(box, shape.getClientRect())
    ) as Konva.Node[];

    onMouseSelect && onMouseSelect(event, selected);

    onMouseUp && onMouseUp(event);
  };

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
    const newStageX =
      -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale;
    const newStageY =
      -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale;

    if (containerRef.current) {
      containerRef.current.focus();
    }

    onWheel(event, { scale: newScale, x: newStageX, y: newStageY });
  };

  const translateStage = (translateX: number, translateY: number) => {
    onNavigateTo && onNavigateTo(stageX + translateX, stageY + translateY);
  };

  const handleNavigateStage = (event: React.KeyboardEvent) => {
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

  const handleKeyDown = (event: React.KeyboardEvent) => {
    handleNavigateStage(event);
    onKeyDown && onKeyDown(event);
  };

  return (
    <div
      tabIndex={1}
      className="editor-stage-container"
      onKeyDown={handleKeyDown}
      ref={containerRef}
    >
      <Stage
        x={stageX}
        y={stageY}
        scaleX={stageScaleX}
        scaleY={stageScaleY}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ backgroundColor: "lightgray", ...style }}
        {...stageProps}
      >
        <Layer>
          <Rect
            stroke="blue"
            strokeWidth={1 / stageScaleX}
            name="selection-rect"
            {...selectionRectProps}
          />
        </Layer>
        {children}
      </Stage>
    </div>
  );
};

const getBoundsRect = ({ x1, y1, x2, y2 }: Bounds) => ({
  x: Math.min(x1, x2),
  y: Math.min(y1, y2),
  width: Math.abs(x1 - x2),
  height: Math.abs(y1 - y2),
});

function getRelativePointerPosition(node: Konva.Group | Konva.Node) {
  const transform = node.getAbsoluteTransform().copy();
  // to detect relative position we need to invert transform
  transform.invert();

  // get pointer (say mouse or touch) position
  const pos = node.getStage().getPointerPosition();

  // now we can find relative point
  return transform.point(pos);
}

export default EditorStage;
