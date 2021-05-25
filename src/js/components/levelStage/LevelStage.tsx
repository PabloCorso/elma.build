import React, { useState } from "react";
import Konva from "konva";
import { Group, Layer } from "react-konva";
import useEditorStageState, {
  useCenterLevelOnMount,
} from "../../hooks/editorHooks";
import { ShapeNode, TemplateBlock, ToolbarProps } from "../../types";
import EditorStage from "../editorStage";
import EditorStageContainer from "../editorStageContainer/EditorStageContainer";
import { ElmaObjectShape, PolygonShape } from "../shapes";
import "./levelStage.css";

type Props = {
  blocks: TemplateBlock[];
  templateBlocks: TemplateBlock[];
  toolbar?: (props: ToolbarProps) => React.ReactNode;
};

const LevelStage: React.FC<Props> = ({ blocks, templateBlocks, toolbar }) => {
  const { stage, stageContainer, navigateTo, fitBoundsRect } =
    useEditorStageState<HTMLDivElement>();

  useCenterLevelOnMount({
    level: templateBlocks,
    stageWidth: stage.width,
    stageHeight: stage.height,
    fitBoundsRect,
  });

  const [selectedNodes, setSelectedNodes] = useState<ShapeNode[]>([]);

  const handleMouseSelect = (
    _event: Konva.KonvaEventObject<MouseEvent>,
    nodes: Konva.Node[]
  ) => {
    setSelectedNodes(nodes);
  };

  return (
    <div className="level-stage">
      {toolbar && (
        <div className="level-stage__toolbar">{toolbar({ fitBoundsRect })}</div>
      )}
      <EditorStageContainer
        {...stageContainer}
        className={"level-stage__container"}
      >
        <EditorStage
          {...stage}
          navigateTo={navigateTo}
          onMouseSelect={handleMouseSelect}
          onWheel={stageContainer.onWheel}
          toolbar={toolbar}
        >
          <Layer>
            {blocks.map((block, index) => {
              return (
                <Group key={`${block.name}_${index}`}>
                  {block.polygons.map((polygon, index) => {
                    const id = `${block.name}_polygon_${index}`;
                    const isSelected = selectedNodes.some(
                      (node) => node.attrs.id === id
                    );
                    return (
                      <PolygonShape
                        key={index}
                        name={id}
                        id={id}
                        polygon={polygon}
                        stroke={isSelected ? "yellow" : "black"}
                        strokeWidth={1 / stage.scale}
                      />
                    );
                  })}
                  {block.objects.map((levelObject, index) => {
                    const id = `${block.name}_object_${index}`;
                    const isSelected = selectedNodes.some(
                      (node) => node.attrs.id === id
                    );
                    return (
                      <ElmaObjectShape
                        key={id}
                        id={id}
                        elmaObject={levelObject}
                        stroke={isSelected ? "yellow" : "default"}
                        strokeWidth={1 / stage.scale}
                      />
                    );
                  })}
                </Group>
              );
            })}
          </Layer>
        </EditorStage>
      </EditorStageContainer>
    </div>
  );
};

export default LevelStage;
