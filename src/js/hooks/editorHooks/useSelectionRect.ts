import Konva from "konva";
import { useEffect, useState } from "react";
import { getBoundsRect, getRelativePointerPosition } from "../../utils";
export const selectionRectName = "selection-rect";

type OnMouseSelect = (
  event: Konva.KonvaEventObject<MouseEvent>,
  nodes: Konva.Node[]
) => void;

type UseSelectionRectProps = {
  scale?: number;
  onMouseSelect?: OnMouseSelect;
};

type UseSelectionRectState = {
  selectionRectProps: Konva.RectConfig;
  onMouseDown: (event: Konva.KonvaEventObject<MouseEvent>) => void;
  onMouseMove: (event: Konva.KonvaEventObject<MouseEvent>) => void;
  onMouseUp: (event: Konva.KonvaEventObject<MouseEvent>) => void;
};

const useSelectionRect = ({
  scale = 1,
  onMouseSelect,
}: UseSelectionRectProps): UseSelectionRectState => {
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
        stroke: "blue",
        strokeWidth: 1 / scale,
        name: selectionRectName,
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
      .find((node: Konva.Node) => node.attrs.selectable)
      .toArray();
    const box = event.target
      .getStage()
      .findOne(`.${selectionRectName}`)
      .getClientRect();
    const selected = shapes.filter((shape) =>
      Konva.Util.haveIntersection(box, shape.getClientRect())
    ) as Konva.Node[];

    onMouseSelect && onMouseSelect(event, selected);
  };

  return {
    selectionRectProps,
    onMouseDown,
    onMouseMove,
    onMouseUp,
  };
};

export default useSelectionRect;
