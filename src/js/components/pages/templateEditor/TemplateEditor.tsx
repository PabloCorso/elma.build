import React, { useReducer } from "react";
import {
  TemplateBlock,
  BlockElement,
  PartialLevel,
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
  getTemplateBlockOverlapShift,
  getConnectionShiftedBlock,
  createTemplateBlock,
} from "../../../utils";
import TabPanel from "../../atoms/tabPanel";
import useEditorStageState from "../../../hooks/editorHooks";
import editorTemplateReducer, {
  initialState,
  addConnection,
  addConnectionBlock,
  addTemplateBlock,
  setTemplateName,
  renameTemplateBlock,
  useConnectionBlocksSelector,
  useTemplateBlocksSelector,
  TemplateState,
} from "./templateStore";
import "./templateEditor.css";

enum TemplateStageTab {
  Level = 0,
  Connections = 1,
}

type Props = {
  level: PartialLevel;
  saveTemplate: (template: TemplateState) => void;
};

const TemplateEditor: React.FC<Props> = ({ level, saveTemplate }) => {
  const templateStage = useEditorStageState<HTMLDivElement>();
  const connectionsStage = useEditorStageState<HTMLDivElement>();

  const [templateState, dispatch] = useReducer(
    editorTemplateReducer,
    initialState
  );
  const templateBlocks = useTemplateBlocksSelector(templateState);
  const connectionBlocks = useConnectionBlocksSelector(templateState);

  const createConnectionBlock = (block: TemplateBlock) => {
    const shift = getTemplateBlockOverlapShift(
      connectionBlocks.map(getConnectionShiftedBlock)
    );
    const origin = { x: shift.x + shift.width, y: 0 };
    dispatch(addConnectionBlock(block, origin));
  };

  const handleCreateBlock = (elements: BlockElement[]) => {
    const newBlock = createTemplateBlock(elements, templateBlocks.length);
    dispatch(addTemplateBlock(newBlock));
    createConnectionBlock(newBlock);
  };

  const handleSaveTemplate = (event: React.FormEvent) => {
    event.preventDefault();
    if (templateState.name) {
      saveTemplate(templateState);
    }
  };

  const [tabIndex, setTabIndex] = React.useState(TemplateStageTab.Level);
  const handleChange = (_event: React.ChangeEvent, value: number) => {
    setTabIndex(value);
  };

  const handleClickBlock = (block: TemplateBlock) => {
    if (tabIndex === TemplateStageTab.Connections) {
      createConnectionBlock(block);
    }
  };

  const handleCreateConnection = (
    from: VertexBlockSelection,
    to: VertexBlockSelection
  ) => {
    dispatch(addConnection(from, to));
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
          onSubmit={handleSaveTemplate}
        >
          <TextField
            label="Template name"
            value={templateState.name}
            onChange={(event) => {
              dispatch(setTemplateName(event.target.value));
            }}
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
              dispatch(renameTemplateBlock(block.id, name));
            }}
            readonly={tabIndex === TemplateStageTab.Connections}
          />
        ))}
      </CardsList>
    </div>
  );
};

export default TemplateEditor;
