import React from "react";
import Konva from "konva";
import { RegularPolygon } from "react-konva";
import { ShapeElementType, ElmaObjectType, ElmaObject } from "../../../types";

type Props = Omit<Konva.RegularPolygonConfig, "stroke"> & {
  elmaObject: ElmaObject;
  stroke?: "default" | string;
};

const ElmaObjectShape: React.FC<Props> = ({
  elmaObject,
  stroke = "default",
  radius = 0.5,
  size = 10,
  x = elmaObject.position.x,
  y = elmaObject.position.y,
  ...props
}) => {
  const strokeValue =
    stroke === "default" ? getObjectTypeStroke(elmaObject.type) : stroke;
  return (
    <RegularPolygon
      x={x}
      y={y}
      radius={radius}
      sides={size}
      stroke={strokeValue}
      element={{ type: ShapeElementType.ElmaObject, data: elmaObject }}
      selectable
      hitStrokeWidth={0}
      shadowForStrokeEnabled={false}
      {...props}
    />
  );
};

const getObjectTypeStroke = (type: ElmaObjectType) => {
  switch (type) {
    case ElmaObjectType.Apple:
      return "red";
    case ElmaObjectType.Exit:
      return "white";
    case ElmaObjectType.Start:
      return "green";
    case ElmaObjectType.Killer:
    default:
      return "black";
  }
};

export default ElmaObjectShape;
