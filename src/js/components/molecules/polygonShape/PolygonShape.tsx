import React from "react";
import Konva from "konva";
import { Line } from "react-konva";
import { ShapeElementType, Polygon } from "../../../types";

export type Props = Omit<Konva.LineConfig, "points"> & {
  polygon: Polygon;
};

const PolygonShape: React.FC<Props> = ({
  polygon,
  stroke = "black",
  ...props
}) => {
  return (
    <Line
      points={getPolygonLinePoints(polygon)}
      stroke={stroke}
      element={{ type: ShapeElementType.Polygon, data: polygon }}
      closed
      selectable
      hitStrokeWidth={0}
      shadowForStrokeEnabled={false}
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
