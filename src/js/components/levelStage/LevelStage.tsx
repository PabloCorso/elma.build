import Konva from "konva";
import React, { useState } from "react";
import { Layer, Rect } from "react-konva";
import { TemplateBlock } from "../../types";
import EditorStage from "../editorStage";
import { ElmaObjectShape, PolygonShape } from "../shapes";

type Props = { blocks: TemplateBlock[]; width: number; height: number };

const LevelStage: React.FC<Props> = ({ blocks, width, height }) => {
  return null;
  // <EditorStage
  //   x={stageX}
  //   y={stageY}
  //   scaleX={stageScale}
  //   scaleY={stageScale}
  //   width={width}
  //   height={height}
  //   onWheel={handleWheel}
  //   onNavigateTo={handleNavigateTo}
  // >
  //   <Layer>
  //     <Rect
  //       x={0}
  //       y={0}
  //       stroke="red"
  //       strokeWidth={1 / stageScale}
  //       width={100}
  //       height={100}
  //     ></Rect>
  //     {blocks.map((block) => {
  //       <>
  //         {block.polygons.map((polygon, index) => {
  //           const id = `${block.id}_polygon_${index}`;
  //           return (
  //             <PolygonShape
  //               key={index}
  //               name={id}
  //               id={id}
  //               polygon={polygon}
  //               strokeWidth={1 / stageScale}
  //             />
  //           );
  //         })}
  //         {block.objects.map((levelObject, index) => {
  //           const id = `${block.id}_object_${index}`;
  //           return (
  //             <ElmaObjectShape
  //               key={id}
  //               id={id}
  //               elmaObject={levelObject}
  //               strokeWidth={1 / stageScale}
  //             />
  //           );
  //         })}
  //       </>;
  //     })}
  //   </Layer>
  // </EditorStage>
};

export default LevelStage;
