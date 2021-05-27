import React from "react";
import { Line } from "react-konva";

type Props = {
  strokeWidth: number;
};

/** Example use:
 *
 * <LineAxis strokeWidth={1 / stage.scale} />
 */
const LineAxis: React.FC<Props> = ({ strokeWidth }) => {
  return (
    <>
      <Line
        stroke="white"
        strokeWidth={strokeWidth}
        points={[-1000, 0, 1000, 0]}
        dashEnabled
        dash={[1]}
      />
      <Line
        stroke="white"
        strokeWidth={strokeWidth}
        points={[0, -1000, 0, 1000]}
        dash={[1]}
      />
    </>
  );
};

export default LineAxis;
