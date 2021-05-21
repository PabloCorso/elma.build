import React, { useState, useRef } from "react";
import {
  Button,
  Divider,
  Input,
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@material-ui/core";
import { Level } from "elmajs";
import LevelEditor, { BlockElement } from "../levelEditor";
import { useElementSize } from "../../hooks";
import EditableText from "../editableText";
import "./app.css";

const levFolder = window.electron.readAllLevels();

export type Block = {
  id: string;
  name: string;
  elements: BlockElement[];
};

const App: React.FC = () => {
  const [level, setLevel] = useState<Level>();

  const handleLevelClick = (levelName: string) => {
    const lev = window.electron.readLevel(levelName);
    setLevel(lev);
  };

  const stageContainerRef = useRef<HTMLDivElement>();
  const editorSize = useElementSize(stageContainerRef);

  const [blocks, setBlocks] = useState<Block[]>([]);
  const handleCreateBlock = (elements: BlockElement[]) => {
    const id = blocks.length + 1 + "";
    const newBlock: Block = {
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
    }
  };

  return (
    <div className="app">
      <div className="app__levels">
        <List>
          {levFolder.map((level) => (
            <ListItem
              key={level}
              onClick={() => {
                handleLevelClick(level);
              }}
              button
            >
              <ListItemText primary={level} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <form noValidate autoComplete="off" onSubmit={handleCreateTemplate}>
          <Input
            value={templateName}
            onChange={(event) => setTemplateName(event.target.value)}
          />
          <Button type="submit" disabled={blocks.length === 0}>
            Create template
          </Button>
        </form>
      </div>
      <div className="app__template-editor">
        <div className="app__level-editor" ref={stageContainerRef}>
          {level && (
            <LevelEditor
              level={level}
              width={editorSize ? editorSize.width : 0}
              height={editorSize ? editorSize.height : 0}
              onCreateBlock={handleCreateBlock}
            />
          )}
        </div>
        <ul className="app__blocks">
          {blocks.map((block, index) => (
            <Paper key={index} elevation={1} className="app__block">
              <EditableText
                value={block.name}
                onChange={(value) => {
                  const newBlocks = blocks.map((item) =>
                    item.id === block.id ? { ...item, name: value } : item
                  );
                  setBlocks(newBlocks);
                }}
                defaultEditMode
              />
            </Paper>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
