import React from "react";
import { Line } from "react-konva";
import { VertexConnection } from "../../types";

type Props = { connection: VertexConnection; strokeWidth: number };

const ConnectionShape: React.FC<Props> = ({ connection, strokeWidth }) => {
  return (
    <Line
      points={[
        connection.v1.x,
        connection.v1.y,
        connection.v2.x,
        connection.v2.y,
      ]}
      stroke="green"
      strokeWidth={strokeWidth}
      hitStrokeWidth={0}
      shadowForStrokeEnabled={false}
      fillEnabled={false}
    />
  );
};
export default ConnectionShape;
