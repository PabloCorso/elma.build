import { AppMenuEvents, WebContentsChannels } from "../types";

type MenuTemplate = (Electron.MenuItemConstructorOptions | Electron.MenuItem)[];

type MenuTemplateProps = {
  isMac: boolean;
  isDev: boolean;
};

const getMenuTemplate = ({
  // isMac = false,
  isDev = false,
}: MenuTemplateProps): MenuTemplate => {
  const menuItems: MenuTemplate = [
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
  ];

  if (isDev) {
    menuItems.push({
      label: "Debug",
      submenu: [
        {
          label: "Open DevTools",
          accelerator: "f12",
          click: (_event, browserWindow) => {
            browserWindow.webContents.openDevTools();
          },
        },
      ],
    });
  }

  return menuItems;
};

export default getMenuTemplate;
