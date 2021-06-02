import { AppMenuEvents, WebContentsChannels } from "../types";

type MenuTemplate = (Electron.MenuItemConstructorOptions | Electron.MenuItem)[];

type MenuTemplateProps = {
  isMac: boolean;
};

const getMenuTemplate = ({
  isMac = false,
}: MenuTemplateProps): MenuTemplate => [
  {
    label: "File",
    submenu: [
      {
        label: "New Level",
        accelerator: "ctrl+n",
        click: (_menuItem, browserWindow) => {
          browserWindow.webContents.send(
            WebContentsChannels.AppMenuEvent,
            AppMenuEvents.NewLevel
          );
        },
      },
      {
        label: "New Template",
        accelerator: "ctrl+t",
        click: (_menuItem, browserWindow) => {
          browserWindow.webContents.send(
            WebContentsChannels.AppMenuEvent,
            AppMenuEvents.NewTemplate
          );
        },
      },
      { type: "separator" },
      {
        label: "Open Level",
        accelerator: "ctrl+o",
        click: (_menuItem, browserWindow) => {
          browserWindow.webContents.send(
            WebContentsChannels.AppMenuEvent,
            AppMenuEvents.OpenLevel
          );
        },
      },
      {
        label: "Open Template",
        click: (_menuItem, browserWindow) => {
          browserWindow.webContents.send(
            WebContentsChannels.AppMenuEvent,
            AppMenuEvents.OpenTemplate
          );
        },
      },
      { type: "separator" },
      {
        label: "Save",
        accelerator: "ctrl+s",
        click: (_menuItem, browserWindow) => {
          browserWindow.webContents.send(
            WebContentsChannels.AppMenuEvent,
            AppMenuEvents.Save
          );
        },
      },
      {
        label: "Save As...",
        click: (_menuItem, browserWindow) => {
          browserWindow.webContents.send(
            WebContentsChannels.AppMenuEvent,
            AppMenuEvents.SaveAs
          );
        },
      },
      { type: "separator" },
      { role: "quit" },
    ],
  },
  { role: "window", submenu: [{ role: "minimize" }, { role: "reload" }] },
  {
    role: "help",
    submenu: [
      {
        label: "Learn More",
        click() {
          require("electron").shell.openExternal("https://electron.atom.io");
        },
      },
    ],
  },
];

export default getMenuTemplate;
