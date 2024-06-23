import { Menu, app } from "electron";
import { GlobalMainWindow } from "../main";

export default Menu.buildFromTemplate([
  {
    label: "Show main window",
    type: "normal",
    click: () => GlobalMainWindow.show(),
  },
  { type: "separator" },
  { label: "About Electron Download Manager", type: "normal" },
  { label: "Quit", type: "normal", click: () => app.quit() },
]);
