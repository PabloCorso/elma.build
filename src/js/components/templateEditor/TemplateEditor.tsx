import React, { useState } from "react";
import { ElmaObject, Level, Polygon } from "elmajs";
import { TemplateBlock, BlockElement, ShapeElementType } from "../../types";
import { Button, TextField } from "@material-ui/core";
import TemplateStage from "../templateStage";
import BlockCards from "../blockCards";
import BlockCard from "../blockCard";
import ZoomOutMapIcon from "@material-ui/icons/ZoomOutMap";
import "./templateEditor.css";
import { getBoundsRect, getLevelBounds } from "../../utils/shapeUtils";

type Props = { level: Level; onCreateTemplate: () => void };

const TemplateEditor: React.FC<Props> = ({ level, onCreateTemplate }) => {
  const [blocks, setBlocks] = useState<TemplateBlock[]>([]);
  const handleCreateBlock = (elements: BlockElement[]) => {
    const id = blocks.length + 1 + "";
    const polygons = elements
      .filter((element) => element.type === ShapeElementType.Polygon)
      .map((element) => element.data) as Polygon[];
    const objects = elements
      .filter((element) => element.type === ShapeElementType.ElmaObject)
      .map((element) => element.data) as ElmaObject[];
    const newBlock: TemplateBlock = {
      id,
      name: `Block ${id}`,
      polygons,
      objects,
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
      <div className="template-editor__stage">
        <TemplateStage
          level={level}
          onCreateBlock={handleCreateBlock}
          toolbar={({ fitBoundsRect }) => (
            <>
              <Button
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
              </Button>
              <Button
                onClick={() => {
                  fitBoundsRect({ x: 0, y: 0, width: 100, height: 100 });
                }}
              >
                GO to 0:0
              </Button>
              <Button
                onClick={() => {
                  fitBoundsRect({ x: 100, y: 100, width: 100, height: 100 });
                }}
              >
                GO to 100:100
              </Button>
              <Button
                onClick={() => {
                  fitBoundsRect({ x: -100, y: -100, width: 100, height: 200 });
                }}
              >
                GO to -100:-100
              </Button>
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
                <Button
                  type="submit"
                  color="primary"
                  disabled={blocks.length === 0}
                >
                  Create template
                </Button>
              </form>
            </>
          )}
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

export default TemplateEditor;
