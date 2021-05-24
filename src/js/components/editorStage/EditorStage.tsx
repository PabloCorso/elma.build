import React, { useEffect, useRef, useState } from "react";
import Konva from "konva";
import { Layer, Rect, Stage, StageProps } from "react-konva";
import { BoundsRect } from "../../types";
import { useElementSize } from "../../hooks";
import {
  getBoundsRect,
  getRelativePointerPosition,
} from "../../utils/shapeUtils";
import "./editorStage.css";

export type StageContextProps = {
  stageX: number;
  stageY: number;
  stageScale: number;
  fitBoundsRect: (rect: BoundsRect) => void;
};

export type ToolbarProps = StageContextProps;

// const StageContext = React.createContext<StageContextProps>(null);

type Props = StageProps & {
  children: (props: StageContextProps) => React.ReactNode;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  onMouseSelect?: (
    event: Konva.KonvaEventObject<MouseEvent>,
    nodes: Konva.Node[]
  ) => void;
  toolbar?: (props: StageContextProps) => React.ReactNode;
};

const EditorStage: React.FC<Props> = ({
  children,
  style,
  toolbar,
  onKeyDown,
  onWheel,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseSelect,
  ...stageProps
}) => {
  const containerRef = useRef<HTMLDivElement>();
  const editorSize = useElementSize(containerRef);
  const stageWidth = editorSize ? editorSize.width : 0;
  const stageHeight = editorSize ? editorSize.height : 0;

  const [stageScale, setStageScale] = useState(8);
  const [stageX, setStageX] = useState(0);
  const [stageY, setStageY] = useState(0);

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

    setStageScale(newScale);
    setStageX(newStageX);
    setStageY(newStageY);

    if (containerRef.current) {
      containerRef.current.focus();
    }

    onWheel && onWheel(event);
  };

  const fitBoundsRect = (rect: BoundsRect) => {
    const padding = 10;
    const rectWidth = rect.width + padding * 2;
    const rectHeight = rect.height + padding * 2;
    const rectX = rect.x + padding;
    const rectY = rect.y + padding;

    const newScaleX = stageWidth / rectWidth;
    const newScaleY = stageHeight / rectHeight;
    const newScale = Math.min(newScaleX, newScaleY);

    navigateTo({ x: rectX, y: rectY }, newScale);
    setStageScale(newScale);
  };

  const navigateTo = (point: Konva.Vector2d, scale?: number) => {
    setStageX(point.x * (scale || stageScale));
    setStageY(point.y * (scale || stageScale));
  };

  const translateStage = (translateX: number, translateY: number) => {
    const newStageX = stageX / stageScale + translateX;
    const newStageY = stageY / stageScale + translateY;
    navigateTo({ x: newStageX, y: newStageY });
  };

  const handleNavigateStage = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      translateStage(50 / stageScale, 0);
    } else if (event.key === "ArrowRight") {
      translateStage(-50 / stageScale, 0);
    } else if (event.key === "ArrowUp") {
      translateStage(0, 50 / stageScale);
    } else if (event.key === "ArrowDown") {
      translateStage(0, -50 / stageScale);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    handleNavigateStage(event);
    onKeyDown && onKeyDown(event);
  };

  const childrenProps = { stageX, stageY, stageScale, fitBoundsRect };

  return (
    <div className="editor-stage">
      {toolbar && (
        <div className="editor-stage__toolbar">{toolbar(childrenProps)}</div>
      )}
      <div
        tabIndex={1}
        className="editor-stage__container"
        onKeyDown={handleKeyDown}
        ref={containerRef}
      >
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
            <Rect
              stroke="red"
              strokeWidth={1 / stageScale}
              width={100}
              height={100}
            />
            <Rect
              stroke="orange"
              strokeWidth={1 / stageScale}
              x={100}
              y={100}
              width={100}
              height={200}
            />
          </Layer>
          {children(childrenProps)}
        </Stage>
      </div>
    </div>
  );
};

export default EditorStage;
