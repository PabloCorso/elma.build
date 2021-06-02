import { IpcMain } from "electron";
import fs from "fs";
import { Level } from "elmajs";
import { ElectronApis, SaveLevelData, SaveTemplateData } from "../types";

const levFolderPath =
  "C:/Users/USER/Documents/Source/elastomania/elma.build/lev";
const templatesFolderPath =
  "C:/Users/USER/Documents/Source/elastomania/elma.build/templates";
const defaultLevelName = "Generated with elma.build";

const initializeMainApi = (ipcMain: IpcMain): void => {
  ipcMain.on(ElectronApis.SaveLevel, (event, data: string) => {
    const { filename, level: parsedLevel } = JSON.parse(data) as SaveLevelData;
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

  ipcMain.on(ElectronApis.SaveTemplate, (event, data: string) => {
    const { filename, template }: SaveTemplateData = JSON.parse(data);
    fs.writeFileSync(
      `${templatesFolderPath}/${filename}.json`,
      JSON.stringify(template)
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
    event.returnValue = templateFile;
  });
};

export default initializeMainApi;
