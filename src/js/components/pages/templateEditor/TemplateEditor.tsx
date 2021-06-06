import React, { useReducer } from "react";
import {
  TemplateBlock,
  BlockElement,
  VertexBlockSelection,
  StoredTemplate,
  PartialLevel,
  Point,
} from "../../../types";
import { Button, Tab, Tabs, TextField } from "@material-ui/core";
import TemplateStage from "../../organisms/templateStage";
import ConnectionsStage from "../../organisms/connectionsStage";
import CardsList from "../../molecules/cardsList";
import BlockCard from "../../molecules/blockCard";
import ZoomOutMapIcon from "@material-ui/icons/ZoomOutMap";
import ImportIcon from "@material-ui/icons/Add";
import {
  getLevelBoundsRect,
  getTemplateBlockOverlapShift,
  createTemplateBlock,
  shiftTemplateBlock,
} from "../../../utils";
import TabPanel from "../../atoms/tabPanel";
import useEditorStageState from "../../../hooks/editorHooks";
import editorTemplateReducer, {
  initialState,
  addConnection,
  addConnectionBlock,
  setTemplateName,
  renameTemplateBlock,
  moveConnectionBlock,
  useConnectionBlocksSelector,
  useTemplateBlocksSelector,
  selectConnectionEdges,
} from "../../../hooks/templateStore";
import { addTemplateBlock } from "../../../hooks/storeHooks/storeActions";
import "./templateEditor.css";

enum TemplateStageTab {
  Level = 0,
  Connections = 1,
}

type Props = {
  level: PartialLevel;
  saveTemplate: (filename: string, template: StoredTemplate) => void;
  requestLevelImport: () => void;
};

const TemplateEditor: React.FC<Props> = ({
  level,
  saveTemplate,
  requestLevelImport: loadLevel,
}) => {
  const templateStage = useEditorStageState<HTMLDivElement>();
  const connectionsStage = useEditorStageState<HTMLDivElement>();

  const [templateState, dispatch] = useReducer(
    editorTemplateReducer,
    initialState
  );
  const templateBlocks = useTemplateBlocksSelector(templateState);
  const connectionBlocks = useConnectionBlocksSelector(templateState);
  const connectionEdges = selectConnectionEdges(templateState);

  const createConnectionBlock = (block: TemplateBlock) => {
    const shift = getTemplateBlockOverlapShift(
      connectionBlocks.map((connectionBlock) =>
        shiftTemplateBlock(connectionBlock.block, connectionBlock.origin)
      )
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
      saveTemplate(templateState.name, templateState);
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

  const handleMoveConnectionBlock = (instance: string, origin: Point) => {
    dispatch(moveConnectionBlock(instance, origin));
  };

  return (
    <div className="template-editor">
      <div className="template-editor__toolbar">
        <Button onClick={loadLevel}>
          <ImportIcon />
        </Button>
        <Button
          onClick={() => {
            if (level) {
              const levelBoundsRect = getLevelBoundsRect(level);
              templateStage.fitBoundsRect({
                ...levelBoundsRect,
                x: -levelBoundsRect.x,
                y: -levelBoundsRect.y,
              });
            }
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
              connectionBlocks={connectionBlocks}
              connectionEdges={connectionEdges}
              createConnection={handleCreateConnection}
              moveConnectionBlock={handleMoveConnectionBlock}
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
