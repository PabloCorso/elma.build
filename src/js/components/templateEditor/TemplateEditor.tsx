import React, { useState } from "react";
import {
  TemplateBlock,
  BlockElement,
  Template,
  PartialLevel,
  VertexConnection,
  Vertex,
} from "../../types";
import { Button, Tab, Tabs, TextField } from "@material-ui/core";
import TemplateStage from "../templateStage";
import ConnectionsStage from "../connectionsStage";
import CardsList from "../cardsList";
import BlockCard from "../blockCard";
import ZoomOutMapIcon from "@material-ui/icons/ZoomOutMap";
import {
  getLevelBoundsRect,
  getLevelsBoundsRect,
  parseBlockElements,
  shiftTemplateBlock,
} from "../../utils";
import TabPanel from "../tabPanel";
import useEditorStageState from "../../hooks/editorHooks";
import "./templateEditor.css";

enum TemplateStageTab {
  Level = 0,
  Connections = 1,
}

type Props = {
  level: PartialLevel;
  createTemplate: (template: Template) => void;
};

const TemplateEditor: React.FC<Props> = ({ level, createTemplate }) => {
  const templateStage = useEditorStageState<HTMLDivElement>();
  const connectionsStage = useEditorStageState<HTMLDivElement>();

  const [templateBlocks, setTemplateBlocks] = useState<TemplateBlock[]>([]);
  const [connectionBlocks, setConnectionBlocks] = useState<TemplateBlock[]>([]);
  const [connections, setConnections] = useState<VertexConnection[]>([]);

  const addBlockToConnections = (block: TemplateBlock) => {
    const instancedBlock = {
      ...block,
      instance: `${block.id}_${connectionBlocks.length}`,
    };
    const shiftedBlock = shiftTemplateBlock(instancedBlock, connectionBlocks);
    setConnectionBlocks((state) => [...state, shiftedBlock]);

    const newBoundsRect = getLevelsBoundsRect([
      ...connectionBlocks,
      shiftedBlock,
    ]);
    connectionsStage.fitBoundsRect({
      ...newBoundsRect,
      x: -newBoundsRect.x,
      y: -newBoundsRect.y,
    });
  };

  const handleCreateBlock = (elements: BlockElement[]) => {
    const blockIndex = templateBlocks.length;
    const blockId = `block_${blockIndex}`;
    const newBlock: TemplateBlock = {
      id: blockId,
      name: `Block ${blockIndex + 1}`,
      ...parseBlockElements(blockId, elements),
    };
    setTemplateBlocks((state) => [...state, newBlock]);
    addBlockToConnections(newBlock);
  };

  const [templateName, setTemplateName] = useState("");
  const handleCreateTemplate = (event: React.FormEvent) => {
    event.preventDefault();
    if (templateName) {
      createTemplate({
        name: templateName,
        blocks: templateBlocks,
        connections,
      });
    }
  };

  const [tabIndex, setTabIndex] = React.useState(TemplateStageTab.Level);
  const handleChange = (_event: React.ChangeEvent, value: number) => {
    setTabIndex(value);
  };

  const handleClickBlock = (block: TemplateBlock) => {
    if (tabIndex === TemplateStageTab.Connections) {
      addBlockToConnections(block);
    }
  };

  const handleCreateConnection = (v1: Vertex, v2: Vertex) => {
    setConnections((state) => [...state, { v1, v2 }]);
  };

  return (
    <div className="template-editor">
      <div className="template-editor__toolbar">
        <Button
          onClick={() => {
            const levelBoundsRect = getLevelBoundsRect(level);
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
              createConnection={handleCreateConnection}
              connections={connections}
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
