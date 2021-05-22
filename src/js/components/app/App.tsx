import React, { useState, useEffect, useRef } from "react";
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
import LevelEditor from "../levelEditor";
import { useElementSize } from "../../hooks";
import EditableText from "../editableText";
import { Block, BlockElement, Template } from "../../types";
import "./app.css";

const App: React.FC = () => {
  const [levFolder, setLevFolder] = useState<string[]>([]);
  const [templatesFolder, setTemplatesFolder] = useState<string[]>([]);
  const [level, setLevel] = useState<Level>();
  const [template, setTemplate] = useState<Template>();

  const updateTemplatesFolder = () => {
    const folder = window.electron.readAllTemplates();
    setTemplatesFolder(folder);
  };

  useEffect(function initialize() {
    const levs = window.electron.readAllLevels();
    setLevFolder(levs);
    updateTemplatesFolder();
  }, []);

  const handleLevelClick = (levelName: string) => {
    const lev = window.electron.readLevel(levelName);
    setLevel(lev);
    setTemplate(null);
  };

  const handleTemplateClick = (templateName: string) => {
    const temp = window.electron.readTemplate(templateName);
    setTemplate(temp);
    setLevel(null);
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
      updateTemplatesFolder();
    }
  };

  return (
    <div className="app">
      <div className="app__levels">
        <List>
          {levFolder.map((level) => (
            <ListItem
              key={level}
              button
              onClick={() => {
                handleLevelClick(level);
              }}
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
          <Button type="submit" color="primary" disabled={blocks.length === 0}>
            Create template
          </Button>
        </form>
        <Divider />
        <List>
          {templatesFolder.map((template) => (
            <ListItem
              key={template}
              button
              onClick={() => {
                handleTemplateClick(template);
              }}
            >
              <ListItemText primary={template} />
            </ListItem>
          ))}
        </List>
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
