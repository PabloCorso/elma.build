import { app, BrowserWindow, ipcMain } from "electron";
import installExtension, {
  REACT_DEVELOPER_TOOLS,
} from "electron-devtools-installer";
import fs from "fs";
import { Level } from "elmajs";
import { ElectronApis, SaveLevelProps, StoredTemplate } from "./js/types";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      nodeIntegration: false,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  mainWindow.maximize();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  createWindow();
  installExtension(REACT_DEVELOPER_TOOLS);
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

const levFolderPath =
  "C:/Users/USER/Documents/Source/elastomania/elma.build/lev";
const templatesFolderPath =
  "C:/Users/USER/Documents/Source/elastomania/elma.build/templates";
const defaultLevelName = "Generated with elma.build";

ipcMain.on(ElectronApis.SaveLevel, (event, data: string) => {
  const { filename, level: parsedLevel } = JSON.parse(data) as SaveLevelProps;
  const level = new Level();
  level.name = parsedLevel.name || defaultLevelName;
  level.polygons = parsedLevel.polygons || [];
  level.objects = parsedLevel.objects || [];
  level.ground = parsedLevel.ground || level.ground;
  level.sky = parsedLevel.sky || level.sky;

  fs.writeFileSync(`${levFolderPath}/${filename}.lev`, level.toBuffer());
  event.returnValue = true;
});

ipcMain.on(ElectronApis.ReadAllLevels, (event) => {
  const levFolder = fs.readdirSync(levFolderPath);
  event.returnValue = levFolder;
});

ipcMain.on(ElectronApis.ReadLevel, (event, name: string) => {
  const levelFile = fs.readFileSync(`${levFolderPath}/${name}`);
  const level = Level.from(levelFile);
  event.returnValue = JSON.stringify(level);
});

ipcMain.on(ElectronApis.SaveTemplate, (event, template: string) => {
  const parsedTemplate: StoredTemplate = JSON.parse(template);
  fs.writeFileSync(
    `${templatesFolderPath}/${parsedTemplate.name}.json`,
    template
  );
  event.returnValue = true;
});

ipcMain.on(ElectronApis.ReadAllTemplates, (event) => {
  const templatesFolder = fs.readdirSync(templatesFolderPath);
  event.returnValue = templatesFolder;
});

ipcMain.on(ElectronApis.ReadTemplate, (event, name: string) => {
  const templateFile = fs.readFileSync(
    `${templatesFolderPath}/${name}`,
    "utf8"
  );
  const template = JSON.parse(templateFile);
  event.returnValue = JSON.stringify(template);
});
