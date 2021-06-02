import React, { useState, useEffect } from "react";
import LevelEditor from "../levelEditor";
import TemplateEditor from "../templateEditor";
import { AppMenuEvents, PartialLevel, StoredTemplate } from "../../../types";
import { resetLevelPosition } from "../../../utils";
import { useEventListener } from "../../../hooks";
import "./app.css";

const App: React.FC = () => {
  const [levFolder, setLevFolder] = useState<string[]>([]);
  const [templatesFolder, setTemplatesFolder] = useState<string[]>([]);
  const [level, setLevel] = useState<PartialLevel>();
  const [templates, setTemplates] = useState<StoredTemplate[]>([]);

  useEffect(() => {
    if (templatesFolder) {
      const loadedTemplates = [];
      for (const templateName of templatesFolder) {
        if (!templateName.startsWith("example")) {
          loadedTemplates.push(window.electron.readTemplate(templateName));
        }
      }

      setTemplates(loadedTemplates);
    }
  }, [templatesFolder]);

  const [isTemplating, setIsTemplating] = useState(false);

  useEventListener("app-menu", (event: CustomEvent) => {
    const appMenuEvent = event.detail as AppMenuEvents;
    switch (appMenuEvent) {
      case AppMenuEvents.NewTemplate: {
        setIsTemplating(true);
        break;
      }
      case AppMenuEvents.NewLevel: {
        setIsTemplating(false);
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

  const handleSaveLevel = (filename: string, level: PartialLevel) => {
    window.electron.saveLevel({ filename, level });
    updateLevFolder();
  };

  useEffect(function initialize() {
    const levs = window.electron.readAllLevels();
    setLevFolder(levs);
    updateTemplatesFolder();
  }, []);

  const handleRequestLevelImport = async () => {
    try {
      const level = await window.electron.readLevelDialog();
      if (level) {
        setLevel(resetLevelPosition(level));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="app">
      <div className="app__editor">
        {isTemplating && (
          <TemplateEditor
            level={level}
            saveTemplate={handleSaveTemplate}
            requestLevelImport={handleRequestLevelImport}
          />
        )}
        {!isTemplating && (
          <LevelEditor templates={templates} saveLevel={handleSaveLevel} />
        )}
      </div>
    </div>
  );
};

export default App;
