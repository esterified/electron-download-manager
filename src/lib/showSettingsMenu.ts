import {
  BrowserWindow,
  IpcMainEvent,
  Menu,
  MenuItem,
  MenuItemConstructorOptions,
} from 'electron';
import hamMenu from '../menus/hamMenu';

export const showSettingsMenu = (event: IpcMainEvent, str: string) => {
  const menu = hamMenu;
  menu.popup({ window: BrowserWindow.fromWebContents(event.sender) });
};
