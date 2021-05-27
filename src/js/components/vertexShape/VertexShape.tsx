import React, { useState } from "react";
import Konva from "konva";
import { Group, RegularPolygon } from "react-konva";

type Props = {
  x: number;
  y: number;
  strokeWidth: number;
  sides?: number;
  radius?: number;
  selected?: boolean;
  onClick?: (event: Konva.KonvaEventObject<MouseEvent>) => void;
};

const VertexShape: React.FC<Props> = ({
  x,
  y,
  strokeWidth,
  radius,
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
    <Group>
      <RegularPolygon
        x={x}
        y={y}
        sides={3}
        radius={radius}
        stroke={color}
        fill={color}
        strokeWidth={strokeWidth}
        hitStrokeWidth={strokeWidth * 1.5}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
      />
    </Group>
  );
};

export default VertexShape;
