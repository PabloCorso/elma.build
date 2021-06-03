import { Button, TextField } from "@material-ui/core";
import React, { useReducer, useState } from "react";
import {
  TemplateBlock,
  PartialLevel,
  ElmaObject,
  Polygon,
  StoredTemplate,
  Point,
} from "../../../types";
import LevelStage from "../../organisms/levelStage";
import CardsList from "../../molecules/cardsList";
import BlockCard from "../../molecules/blockCard";
import useEditorStageState from "../../../hooks/editorHooks";
import { getTemplateBlockOverlapShift } from "../../../utils";
import { selectTemplateBlocks } from "../../../hooks/templateStore";
import editorLevelReducer, {
  initialState,
  useLevelBlocksSelector,
  addLevelBlock,
  moveLevelBlock,
} from "../../../hooks/levelStore";
import { addTemplateBlock } from "../../../hooks/storeHooks";
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
  const [levelState, dispatch] = useReducer(editorLevelReducer, initialState);
  const stageBlocks = useLevelBlocksSelector(levelState);

  const [levelName, setLevelName] = useState("");

  const handleClickBlock = (block: TemplateBlock) => {
    if (!levelState.blocks.byId[block.id]) {
      dispatch(addTemplateBlock(block));
    }

    const shift = getTemplateBlockOverlapShift(
      stageBlocks.map((stageBlock) => stageBlock.block)
    );
    const origin = { x: shift.x + shift.width, y: 0 };
    dispatch(addLevelBlock(block, origin));
  };

  const handleCreateLevel = (event: React.FormEvent) => {
    event.preventDefault();

    const polygons: Polygon[] = [];
    const objects: ElmaObject[] = [];
    for (const stageBlock of stageBlocks) {
      polygons.push(...stageBlock.block.polygons);
      objects.push(...stageBlock.block.objects);
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

  const handleMoveLevelBlock = (instance: string, origin: Point) => {
    dispatch(moveLevelBlock(instance, origin));
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
          levelBlocks={stageBlocks}
          stageState={stageState}
          connectionsById={{}}
          moveLevelBlock={handleMoveLevelBlock}
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
