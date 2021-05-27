import React, { useEffect, useState } from "react";
import Konva from "konva";
import { Layer, Rect, Stage, StageProps } from "react-konva";
import {
  getBoundsRect,
  getRelativePointerPosition,
} from "../../utils/shapeUtils";
import { NavigateTo } from "../../types";

type Props = Omit<StageProps, "scale"> & {
  scale: number;
  onMouseSelect?: (
    event: Konva.KonvaEventObject<MouseEvent>,
    nodes: Konva.Node[]
  ) => void;
  navigateTo: NavigateTo;
};

const EditorStage: React.FC<Props> = ({
  x: stageX,
  y: stageY,
  scale: stageScale,
  width: stageWidth,
  height: stageHeight,
  children,
  style,
  navigateTo,
  onWheel,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseSelect,
  ...stageProps
}) => {
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
    const newStageX = -(
      mousePointTo.x -
      stage.getPointerPosition().x / newScale
    );
    const newStageY = -(
      mousePointTo.y -
      stage.getPointerPosition().y / newScale
    );

    navigateTo({ x: newStageX, y: newStageY }, newScale);

    onWheel && onWheel(event);
  };

  return (
    <Stage
      width={stageWidth}
      height={stageHeight}
      x={stageX}
      y={stageY}
      scaleX={stageScale}
      scaleY={stageScale}
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
          strokeWidth={1 / stageScale}
          name="selection-rect"
          {...selectionRectProps}
        />
      </Layer>
      {children}
    </Stage>
  );
};

export default EditorStage;
