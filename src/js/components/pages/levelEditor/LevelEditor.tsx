import { Button, TextField } from "@material-ui/core";
import React, { useState } from "react";
import {
  TemplateBlock,
  PartialLevel,
  ElmaObject,
  Polygon,
  StoredTemplate,
} from "../../../types";
import LevelStage from "../../organisms/levelStage";
import CardsList from "../../molecules/cardsList";
import BlockCard from "../../molecules/blockCard";
import useEditorStageState from "../../../hooks/editorHooks";
import { shiftTemplateBlockFromOverlap } from "../../../utils";
import { selectTemplateBlocks } from "../../../hooks/templateStore";
import "./levelEditor.css";

type Props = {
  templates: StoredTemplate[];
  saveLevel: (filename: string, level: PartialLevel) => void;
};

const LevelEditor: React.FC<Props> = ({
  templates = [],
  saveLevel: createLevel,
}) => {
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

    createLevel(levelName, level);
  };

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
        <LevelStage
          blocks={stageBlocks}
          stageState={stageState}
          connectionsById={{}}
        />
      </div>
      <div className="level-editor__blocks">
        {templates.map((template) => {
          const blocks = selectTemplateBlocks(template);
          return (
            <CardsList key={template.name} title={template.name}>
              {blocks.map((block, index) => (
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
          );
        })}
      </div>
    </div>
  );
};

export default LevelEditor;
