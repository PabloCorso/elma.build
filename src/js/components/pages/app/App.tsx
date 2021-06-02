import React, { useState, useEffect } from "react";
import { List, ListItem, ListItemText, ListSubheader } from "@material-ui/core";
import TemplateEditor from "../templateEditor";
import LevelEditor from "../levelEditor";
import { AppMenuEvents, PartialLevel, StoredTemplate } from "../../../types";
import { resetLevelPosition } from "../../../utils";
import { useEventListener } from "../../../hooks";
import "./app.css";

const App: React.FC = () => {
  const [levFolder, setLevFolder] = useState<string[]>([]);
  const [templatesFolder, setTemplatesFolder] = useState<string[]>([]);
  const [level, setLevel] = useState<PartialLevel>();
  const [template, setTemplate] = useState<StoredTemplate>();

  useEventListener("app-menu", (event: CustomEvent) => {
    const appMenuEvent = event.detail as AppMenuEvents;
    switch (appMenuEvent) {
      case AppMenuEvents.NewTemplate: {
        console.log("new template");
        break;
      }
      default: {
        break;
      }
    }
  });

  const updateTemplatesFolder = () => {
    const folder = window.electron.readAllTemplates();
    setTemplatesFolder(folder);
  };

  const handleSaveTemplate = (filename: string, template: StoredTemplate) => {
    window.electron.saveTemplate({ filename, template });
    updateTemplatesFolder();
  };

  const updateLevFolder = () => {
    const folder = window.electron.readAllLevels();
    setLevFolder(folder);
  };

  const handleCreateLevel = (filename: string, level: PartialLevel) => {
    window.electron.saveLevel({ filename, level });
    updateLevFolder();
  };

  useEffect(function initialize() {
    const levs = window.electron.readAllLevels();
    setLevFolder(levs);
    updateTemplatesFolder();
  }, []);

  const handleLevelClick = (levelName: string) => {
    const lev = window.electron.readLevel(levelName);
    setLevel(resetLevelPosition(lev));
    setTemplate(null);
  };

  const handleTemplateClick = (templateName: string) => {
    const temp = window.electron.readTemplate(templateName);
    setTemplate(temp);
    setLevel(null);
  };

  return (
    <div className="app">
      <div className="app__levels">
        <List subheader={<ListSubheader component="div">Levels</ListSubheader>}>
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
        <List
          subheader={<ListSubheader component="div">Templates</ListSubheader>}
        >
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
        {level && (
          <TemplateEditor level={level} saveTemplate={handleSaveTemplate} />
        )}
        {template && (
          <LevelEditor template={template} createLevel={handleCreateLevel} />
        )}
      </div>
    </div>
  );
};

export default App;
