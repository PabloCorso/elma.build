import React from "react";
import { Group } from "react-konva";
import { Props as PolygonShapeProps } from "./PolygonShape";

type PolygonElement = React.ReactElement<PolygonShapeProps>;

type Props = {
  name?: string;
  children: PolygonElement | PolygonElement[];
};

const LevelShape: React.FC<Props> = ({ name, children }) => {
  return <Group name={name}>{children}</Group>;
};

export default LevelShape;
