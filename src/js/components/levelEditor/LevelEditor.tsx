import { Button, TextField } from "@material-ui/core";
import React, { useMemo, useState } from "react";
import {
  TemplateBlock,
  Template,
  SaveLevelProps,
  PartialLevel,
  ElmaObject,
  Polygon,
} from "../../types";
import LevelStage from "../levelStage";
import CardsList from "../cardsList";
import BlockCard from "../blockCard";
import useEditorStageState from "../../hooks/editorHooks";
import { shiftTemplateBlockFromOverlap } from "../../utils";
import "./levelEditor.css";

type Props = {
  template: Template;
  createLevel: (props: SaveLevelProps) => void;
};

const LevelEditor: React.FC<Props> = ({ template, createLevel }) => {
  const stageState = useEditorStageState<HTMLDivElement>();

  const [levelName, setLevelName] = useState("");
  const [stageBlocks, setStageBlocks] = useState<TemplateBlock[]>([]);

  const handleClickBlock = (block: TemplateBlock) => {
    const instancedBlock = {
      ...block,
      instance: `${block.id}_${stageBlocks.length}`,
    };
    const shiftedBlock = shiftTemplateBlockFromOverlap(
      instancedBlock,
      stageBlocks
    );

    setStageBlocks((state) => [...state, shiftedBlock]);
  };

  const handleCreateLevel = (event: React.FormEvent) => {
    event.preventDefault();

    const polygons: Polygon[] = [];
    const objects: ElmaObject[] = [];
    for (const block of stageBlocks) {
      polygons.push(...block.polygons);
      objects.push(...block.objects);
    }

    const level: PartialLevel = {
      name: "Generated with elma.build",
      polygons,
      objects,
      ground: "sky",
      sky: "groud",
    };

    createLevel({ filename: levelName, level });
  };

  // const connectionsById = useMemo(() => {
  //   const result: { [key: string]: { [key: string]: string } } = {};
  //   for (const connection of template.connections) {
  //     result[connection.v1.polygonId] = {
  //       ...result[connection.v1.polygonId],
  //       [connection.v1.id]: connection.v2.id,
  //     };
  //     result[connection.v2.polygonId] = {
  //       ...result[connection.v2.polygonId],
  //       [connection.v2.id]: connection.v1.id,
  //     };
  //   }

  //   return result;
  // }, [template.connections]);

  return (
    <div className="level-editor">
      <div className="level-editor__toolbar">
        <form
          className="level-editor__info"
          noValidate
          autoComplete="off"
          onSubmit={handleCreateLevel}
        >
          <TextField
            label="Level name"
            value={levelName}
            onChange={(event) => setLevelName(event.target.value)}
          />
          <Button type="submit" color="primary">
            Create level
          </Button>
        </form>
      </div>
      <div className="level-editor__stage">
        {/* <LevelStage
          blocks={stageBlocks}
          templateBlocks={template.blocks}
          stageState={stageState}
          connectionsById={connectionsById}
        /> */}
      </div>
      <CardsList className="level-editor__blocks">
        {template.blocks.map((block, index) => (
          <BlockCard
            key={index}
            block={block}
            onClick={() => {
              handleClickBlock(block);
            }}
            readonly
          />
        ))}
      </CardsList>
    </div>
  );
};

export default LevelEditor;
