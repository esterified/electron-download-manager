/* eslint-disable @typescript-eslint/no-empty-function */
import { Menu, app } from 'electron';

export default Menu.buildFromTemplate([
  {
    label: 'Paste urls from clipboard',
    click: () => {},
  },
  {
    label: 'Paste urls from file',
    click: () => {},
  },
  { type: 'separator' },
  {
    label: 'Export/Import',
    submenu: [
      {
        label: 'Export 1',
      },
      {
        label: 'Export 2',
        click: () => {
          console.log('window');
        },
      },
      { type: 'separator' },
      { label: 'settings', type: 'normal' },
    ],
  },
  { type: 'separator' },
  {
    label: 'Preferences...',
    click: () => {},
  },
  { type: 'separator' },
  {
    label: 'Check for Updates...',
  },
  {
    label: 'About',
  },
  { type: 'separator' },
  {
    label: 'Quit',
    click: () => {
      app.quit();
    },
  },
]);
