import React, { useRef, useState } from "react";
import { Level } from "elmajs";
import { TemplateBlock, BlockElement } from "../../types";
import { Button, TextField } from "@material-ui/core";
import { useElementSize } from "../../hooks";
import TemplateStage from "../templateStage";
import BlockCards from "../blockCards";
import BlockCard from "../blockCard";
import "./templateEditor.css";

type Props = { level: Level; onCreateTemplate: () => void };

const TemplateBuilder: React.FC<Props> = ({ level, onCreateTemplate }) => {
  const stageContainerRef = useRef<HTMLDivElement>();
  const editorSize = useElementSize(stageContainerRef);

  const [blocks, setBlocks] = useState<TemplateBlock[]>([]);
  const handleCreateBlock = (elements: BlockElement[]) => {
    const id = blocks.length + 1 + "";
    const newBlock: TemplateBlock = {
      id,
      name: `Block ${id}`,
      elements,
    };
    setBlocks((state) => [...state, newBlock]);
  };

  const [templateName, setTemplateName] = useState("");
  const handleCreateTemplate = (event: React.FormEvent) => {
    event.preventDefault();
    if (templateName) {
      window.electron.saveTemplate({ name: templateName, blocks });
      onCreateTemplate();
    }
  };
  return (
    <div className="template-editor">
      <form
        className="template-editor__info"
        noValidate
        autoComplete="off"
        onSubmit={handleCreateTemplate}
      >
        <TextField
          label="Template name"
          value={templateName}
          onChange={(event) => setTemplateName(event.target.value)}
        />
        <Button type="submit" color="primary" disabled={blocks.length === 0}>
          Create template
        </Button>
      </form>
      <div className="template-editor__stage" ref={stageContainerRef}>
        <TemplateStage
          level={level}
          width={editorSize ? editorSize.width : 0}
          height={editorSize ? editorSize.height : 0}
          onCreateBlock={handleCreateBlock}
        />
      </div>
      <BlockCards className="template-editor__blocks">
        {blocks.map((block, index) => (
          <BlockCard
            key={index}
            block={block}
            onRename={(name) => {
              const newBlocks = blocks.map((item) =>
                item.id === block.id ? { ...item, name } : item
              );
              setBlocks(newBlocks);
            }}
          />
        ))}
      </BlockCards>
    </div>
  );
};

export default TemplateBuilder;
