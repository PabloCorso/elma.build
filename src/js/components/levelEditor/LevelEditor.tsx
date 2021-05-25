import { Button, TextField } from "@material-ui/core";
import React, { useState } from "react";
import { TemplateBlock, Template } from "../../types";
import LevelStage from "../levelStage";
import BlockCards from "../blockCards";
import BlockCard from "../blockCard";
import "./levelEditor.css";

type Props = {
  template: Template;
};

const LevelEditor: React.FC<Props> = ({ template }) => {
  const [levelName, setLevelName] = useState("");
  const [stageBlocks, setStageBlocks] = useState<TemplateBlock[]>([]);

  const handleClickBlock = (block: TemplateBlock) => {
    setStageBlocks((state) => [...state, block]);
  };

  const handleCreateLevel = (event: React.FormEvent) => {
    event.preventDefault();
  };

  return (
    <div className="level-editor">
      <div className="level-editor__stage">
        <LevelStage
          blocks={stageBlocks}
          templateBlocks={template.blocks}
          toolbar={() => (
            <>
              {/* <Button
                onClick={() => {
                  const levelBounds = getLevelBounds(level);
                  const levelBoundsRect = getBoundsRect(levelBounds);
                  fitBoundsRect({
                    ...levelBoundsRect,
                    x: -levelBoundsRect.x,
                    y: -levelBoundsRect.y,
                  });
                }}
              >
                <ZoomOutMapIcon />
              </Button> */}
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
            </>
          )}
        />
      </div>
      <BlockCards className="level-editor__blocks">
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
      </BlockCards>
    </div>
  );
};

export default LevelEditor;
