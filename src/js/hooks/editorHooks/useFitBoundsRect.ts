import { BoundsRect, NavigateTo } from "../../types";

type UseFitBoundsRectProps = {
  stageWidth: number;
  stageHeight: number;
  navigateTo: NavigateTo;
};

function useFitBoundsRect({
  stageWidth,
  stageHeight,
  navigateTo,
}: UseFitBoundsRectProps) {
  return (rect: BoundsRect): void => {
    const padding = 10;
    const rectWidth = rect.width + padding * 2;
    const rectHeight = rect.height + padding * 2;
    const rectX = rect.x + padding;
    const rectY = rect.y + padding;

    const newScaleX = stageWidth / rectWidth;
    const newScaleY = stageHeight / rectHeight;
    const newScale = Math.min(newScaleX, newScaleY);

    const widthDiff = stageWidth / newScale - rectWidth;
    const heightDiff = stageHeight / newScale - rectHeight;
    const newX = widthDiff > heightDiff ? rectX + widthDiff / 2 : rectX;
    const newY = heightDiff > widthDiff ? rectY + heightDiff / 2 : rectY;

    navigateTo({ x: newX, y: newY }, newScale);
  };
}

export default useFitBoundsRect;
