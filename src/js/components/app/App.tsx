import React, { useState, useRef, useEffect } from "react";
import { List, ListItem, ListItemText } from "@material-ui/core";
import { Level } from "elmajs";
import LevelEditor from "../levelEditor";
import { useElementSize } from "../../hooks";
import useResizeObserver from "@react-hook/resize-observer";
import "./app.css";

const levFolderPath =
  "C:/Users/USER/Documents/Source/elastomania/elma.build/lev";
const levFolder = window.electron.readLevFolderSync(levFolderPath);

const App: React.FC = () => {
  const [level, setLevel] = useState<Level>();

  const handleLevelClick = (levelPath: string) => {
    const lev = window.electron.readLevel(`${levFolderPath}/${levelPath}`);
    setLevel(lev);
  };

  const stageContainerRef = useRef<HTMLDivElement>();
  const [editorSize, setEditorSize] = useState<DOMRectReadOnly>();

  useResizeObserver(stageContainerRef, (entry) =>
    setEditorSize(entry.contentRect)
  );

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
      </div>
      <div className="app__stage" ref={stageContainerRef}>
        {level && (
          <LevelEditor
            level={level}
            width={editorSize ? editorSize.width : 0}
            height={editorSize ? editorSize.height : 0}
          />
        )}
      </div>
    </div>
  );
};

export default App;
