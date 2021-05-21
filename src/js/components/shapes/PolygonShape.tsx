import React from "react";
import { Polygon } from "elmajs";
import { Line } from "react-konva";
import Konva from "konva";

export type Props = {
  polygon: Polygon;
} & Omit<Konva.LineConfig, "points">;

const PolygonShape: React.FC<Props> = ({
  polygon,
  stroke = "black",
  ...props
}) => {
  return (
    <Line
      points={getPolygonLinePoints(polygon)}
      closed
      stroke={stroke}
      selectable
      element={{ type: "polygon", data: polygon }}
      {...props}
    ></Line>
  );
};

const getPolygonLinePoints = (polygon: Polygon) => {
  const points: number[] = [];
  for (const vertex of polygon.vertices) {
    points.push(vertex.x, vertex.y);
  }

  return points;
};

export default PolygonShape;
