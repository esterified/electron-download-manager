/* eslint-disable @typescript-eslint/no-empty-function */
import { Menu, app } from "electron";
import { GlobalMainWindow } from "../main";

export default (page?: string) =>
  Menu.buildFromTemplate([
    {
      label: "Paste urls from clipboard",
      click: () => {},
    },
    {
      label: "Paste urls from file",
      click: () => {},
    },
    { type: "separator" },
    {
      label: "Export/Import",
      submenu: [
        {
          label: "Export 1",
        },
        {
          label: "Export 2",
          click: () => {
            console.log("window");
          },
        },
        { type: "separator" },
        { label: "settings", type: "normal" },
      ],
    },
    { type: "separator" },
    {
      label: "Preferences...",
      enabled: page !== "setting",
      click: () => {
        GlobalMainWindow.webContents.send("openSettings");
      },
    },
    { type: "separator" },
    {
      label: "Check for Updates...",
    },
    {
      label: "About",
    },
    { type: "separator" },
    {
      label: "Quit",
      click: () => {
        app.quit();
      },
    },
  ]);
