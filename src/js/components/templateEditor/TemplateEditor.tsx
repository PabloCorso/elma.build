import React, { useState } from "react";
import { ElmaObject, Level, Polygon } from "elmajs";
import {
  TemplateBlock,
  BlockElement,
  ShapeElementType,
  Template,
} from "../../types";
import { Button, Tab, Tabs, TextField } from "@material-ui/core";
import TemplateStage from "../templateStage";
import ConnectionsStage from "../connectionsStage";
import CardsList from "../cardsList";
import BlockCard from "../blockCard";
import ZoomOutMapIcon from "@material-ui/icons/ZoomOutMap";
import { getBoundsRect, getLevelBounds } from "../../utils/shapeUtils";
import TabPanel from "../tabPanel";
import useEditorStageState from "../../hooks/editorHooks";
import "./templateEditor.css";

enum TemplateStageTab {
  Level = 0,
  Connections = 1,
}

type Props = { level: Level; createTemplate: (template: Template) => void };

const TemplateEditor: React.FC<Props> = ({ level, createTemplate }) => {
  const templateStage = useEditorStageState<HTMLDivElement>();
  const connectionsStage = useEditorStageState<HTMLDivElement>();

  const [templateBlocks, setTemplateBlocks] = useState<TemplateBlock[]>([]);
  const handleCreateBlock = (elements: BlockElement[]) => {
    const id = templateBlocks.length + 1 + "";
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
    setTemplateBlocks((state) => [...state, newBlock]);
  };

  const [templateName, setTemplateName] = useState("");
  const handleCreateTemplate = (event: React.FormEvent) => {
    event.preventDefault();
    if (templateName) {
      createTemplate({ name: templateName, blocks: templateBlocks });
    }
  };

  const [tabIndex, setTabIndex] = React.useState(TemplateStageTab.Level);
  const handleChange = (_event: React.ChangeEvent, value: number) => {
    setTabIndex(value);
  };

  const [connectionBlocks, setConnectionBlocks] = useState<TemplateBlock[]>([]);

  const handleClickBlock = (block: TemplateBlock) => {
    if (tabIndex === TemplateStageTab.Connections) {
      setConnectionBlocks((state) => [...state, block]);
    }
  };

  return (
    <div className="template-editor">
      <div className="template-editor__toolbar">
        <Button
          onClick={() => {
            const levelBounds = getLevelBounds(level);
            const levelBoundsRect = getBoundsRect(levelBounds);
            templateStage.fitBoundsRect({
              ...levelBoundsRect,
              x: -levelBoundsRect.x,
              y: -levelBoundsRect.y,
            });
          }}
        >
          <ZoomOutMapIcon />
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
            disabled={templateBlocks.length === 0}
          >
            Create template
          </Button>
        </form>
      </div>
      <div className="template-editor__body">
        <Tabs
          className="template-editor__tabs"
          value={tabIndex}
          onChange={handleChange}
        >
          <Tab label="Level" />
          <Tab label="Connections" />
        </Tabs>
        <div className="template-editor__stage">
          <TabPanel value={TemplateStageTab.Level} index={tabIndex}>
            <TemplateStage
              level={level}
              stageState={templateStage}
              onCreateBlock={handleCreateBlock}
            />
          </TabPanel>
          <TabPanel value={TemplateStageTab.Connections} index={tabIndex}>
            <ConnectionsStage
              blocks={connectionBlocks}
              templateBlocks={templateBlocks}
              stageState={connectionsStage}
            />
          </TabPanel>
        </div>
      </div>
      <CardsList className="template-editor__blocks">
        {templateBlocks.map((block, index) => (
          <BlockCard
            key={index}
            block={block}
            onClick={() => {
              handleClickBlock(block);
            }}
            onRename={(name) => {
              const newBlocks = templateBlocks.map((item) =>
                item.id === block.id ? { ...item, name } : item
              );
              setTemplateBlocks(newBlocks);
            }}
            readonly={tabIndex === TemplateStageTab.Connections}
          />
        ))}
      </CardsList>
    </div>
  );
};

export default TemplateEditor;
