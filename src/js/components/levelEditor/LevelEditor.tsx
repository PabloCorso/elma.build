import { Button, TextField } from "@material-ui/core";
import React, { useRef, useState } from "react";
import { useElementSize } from "../../hooks";
import { Template } from "../../types";
import LevelStage from "../levelStage";
import BlockCards from "../blockCards";
import BlockCard from "../blockCard";
import "./levelEditor.css";

type Props = {
  template: Template;
};

const LevelEditor: React.FC<Props> = ({ template }) => {
  const stageContainerRef = useRef<HTMLDivElement>();
  const editorSize = useElementSize(stageContainerRef);

  const [levelName, setLevelName] = useState("");

  return (
    <div className="level-editor">
      <form
        className="level-editor__info"
        noValidate
        autoComplete="off"
        onSubmit={(event) => event.preventDefault()}
      >
        <TextField
          label="Template name"
          value={levelName}
          onChange={(event) => setLevelName(event.target.value)}
        />
        <Button type="submit" color="primary">
          Create level
        </Button>
      </form>
      <div className="template-editor__stage" ref={stageContainerRef}>
        <LevelStage
          width={editorSize ? editorSize.width : 0}
          height={editorSize ? editorSize.height : 0}
        />
      </div>
      <BlockCards className="template-editor__blocks">
        {template.blocks.map((block, index) => (
          <BlockCard key={index} block={block} readonly />
        ))}
      </BlockCards>
    </div>
  );
};

export default LevelEditor;
