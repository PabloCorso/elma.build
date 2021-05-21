import React from "react";
import { Group } from "react-konva";
import Konva from "konva";
import { Props as PolygonShapeProps } from "./PolygonShape";

type PolygonElement = React.ReactElement<PolygonShapeProps>;
type RegularElement = React.ReactElement<Konva.RegularPolygonConfig>;

type LevelElement = PolygonElement | RegularElement;

type Props = {
  name?: string;
  children: React.ReactNode | React.ReactNode[];
};

const LevelShape: React.FC<Props> = ({ name, children }) => {
  return <Group name={name}>{children}</Group>;
};

export default LevelShape;
