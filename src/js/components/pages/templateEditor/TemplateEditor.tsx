import React, { useState } from "react";
import {
  TemplateBlock,
  BlockElement,
  Template,
  PartialLevel,
  ConnectionBlock,
  VertexBlockSelection,
} from "../../../types";
import { Button, Tab, Tabs, TextField } from "@material-ui/core";
import TemplateStage from "../../organisms/templateStage";
import ConnectionsStage from "../../organisms/connectionsStage";
import CardsList from "../../molecules/cardsList";
import BlockCard from "../../molecules/blockCard";
import ZoomOutMapIcon from "@material-ui/icons/ZoomOutMap";
import {
  getLevelBoundsRect,
  parseBlockElements,
  getTemplateBlockOverlapShift,
  getConnectionShiftedBlock,
  addConnection,
} from "../../../utils";
import TabPanel from "../../atoms/tabPanel";
import useEditorStageState from "../../../hooks/editorHooks";
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
  const [connectionBlocks, setConnectionBlocks] = useState<ConnectionBlock[]>(
    []
  );

  const addConnectionBlock = (block: TemplateBlock) => {
    const instance = `${block.id}_${connectionBlocks.length}`;
    const shift = getTemplateBlockOverlapShift(
      connectionBlocks.map(getConnectionShiftedBlock)
    );
    const origin = { x: shift.x + shift.width, y: 0 };
    const connectionBlock: ConnectionBlock = {
      block,
      instance,
      origin,
      connectedBlocks: [],
    };
    setConnectionBlocks((state) => [...state, connectionBlock]);
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
    addConnectionBlock(newBlock);
  };

  const [templateName, setTemplateName] = useState("");
  const handleCreateTemplate = (event: React.FormEvent) => {
    event.preventDefault();
    if (templateName) {
      createTemplate({
        name: templateName,
        blocks: templateBlocks,
        connectionBlocks,
      });
    }
  };

  const [tabIndex, setTabIndex] = React.useState(TemplateStageTab.Level);
  const handleChange = (_event: React.ChangeEvent, value: number) => {
    setTabIndex(value);
  };

  const handleClickBlock = (block: TemplateBlock) => {
    if (tabIndex === TemplateStageTab.Connections) {
      addConnectionBlock(block);
    }
  };

  const handleCreateConnection = (
    from: VertexBlockSelection,
    to: VertexBlockSelection
  ) => {
    setConnectionBlocks((state) =>
      addConnection({ connectionBlocks: state, from, to })
    );
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
              stageState={connectionsStage}
              templateBlocks={templateBlocks}
              connectionBlocks={connectionBlocks}
              createConnection={handleCreateConnection}
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
