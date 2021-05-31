import React, { useState } from "react";
import Konva from "konva";
import { RegularPolygon } from "react-konva";

type Props = {
  x: number;
  y: number;
  strokeWidth: number;
  radius: number;
  sides?: number;
  selected?: boolean;
  onClick?: (event: Konva.KonvaEventObject<MouseEvent>) => void;
};

const VertexShape: React.FC<Props> = ({
  x,
  y,
  strokeWidth,
  radius,
  sides = 3,
  selected = false,
  onClick,
}) => {
  const [isOver, setIsOver] = useState(false);
  const handleMouseEnter = () => {
    setIsOver(true);
  };
  const handleMouseLeave = () => {
    setIsOver(false);
  };

  const color = isOver || selected ? "yellow" : "blue";
  return (
    <RegularPolygon
      x={x}
      y={y}
      stroke={color}
      radius={radius}
      sides={sides}
      fill={color}
      rotation={180}
      strokeWidth={strokeWidth}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      hitStrokeWidth={0}
      shadowForStrokeEnabled={false}
      perfectDrawEnabled={false}
    />
  );
};

export default VertexShape;
