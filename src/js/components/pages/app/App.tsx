import React, { useState, useEffect } from "react";
import LevelEditor from "../levelEditor";
import TemplateEditor from "../templateEditor";
import { AppMenuEvents, PartialLevel, StoredTemplate } from "../../../types";
import { resetLevelPosition } from "../../../utils";
import { useEventListener } from "../../../hooks";
import "./app.css";

const App: React.FC = () => {
  const [level, setLevel] = useState<PartialLevel>();
  const [templatesFolder, setTemplatesFolder] = useState<string[]>();
  const [templates, setTemplates] = useState<StoredTemplate[]>([]);
  const [isTemplating, setIsTemplating] = useState(false);

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

  useEffect(function initialize() {
    const folder = window.electron.readAllTemplates();
    setTemplatesFolder(folder);
  }, []);

  useEffect(
    function onChangeEditor() {
      setLevel(null);
    },
    [isTemplating]
  );

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

  const handleSaveTemplate = (filename: string, template: StoredTemplate) => {
    window.electron.saveTemplate({ filename, template });
  };

  const handleSaveLevel = (filename: string, level: PartialLevel) => {
    window.electron.saveLevel({ filename, level });
  };

  const handleRequestLevelImport = async () => {
    try {
      const level = await window.electron.readLevelDialog();
      if (level) {
        setLevel(resetLevelPosition(level));
      }
    } catch (error) {
      console.error(error);
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
