import React, { useState, useEffect } from "react";
import { List, ListItem, ListItemText, ListSubheader } from "@material-ui/core";
import { Level } from "elmajs";
import TemplateEditor from "../templateEditor";
import LevelEditor from "../levelEditor";
import { Template } from "../../types";
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
          <TemplateEditor
            level={level}
            onCreateTemplate={updateTemplatesFolder}
          />
        )}
        {template && <LevelEditor template={template} />}
      </div>
    </div>
  );
};

export default App;
