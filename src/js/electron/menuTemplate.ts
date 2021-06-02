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
      { label: "New Template" },
      { type: "separator" },
      { label: "Open Level" },
      { label: "Open Template" },
      { type: "separator" },
      { label: "Save" },
      { label: "Save As..." },
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
