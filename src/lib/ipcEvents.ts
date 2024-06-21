import { BrowserWindow, Menu, ipcMain } from 'electron';
import { downloadHandler } from './addDownloadLink';
import { getDownloadsHandler } from './getDownloads';
import { cancelDownloadHandler } from './cancelDownload';
import { openDirHandler } from './openDirHandler';

import {
  deleteDownloadHandler,
  pauseDownloadHandler,
  playDownloadHandler,
} from './bulkOperations';

export const initIPCEvents = () => {
  ipcMain.on('addDownloadLink', downloadHandler);
  ipcMain.on('bulkDeleteDownload', deleteDownloadHandler);
  ipcMain.on('bulkPlayDownload', playDownloadHandler);
  ipcMain.on('bulkPauseDownload', pauseDownloadHandler);
  ipcMain.handle('getDownloads', getDownloadsHandler);
  ipcMain.handle('cancelDownloadLink', cancelDownloadHandler);
  ipcMain.handle('openDir', openDirHandler);
  ipcMain.on('show-context-menu', (event) => {
    const template = [
      { id: '1', label: 'one', after: ['3'] },
      { id: '2', label: 'two', before: ['1'] },
      { id: '3', label: 'three' },
    ];
    const menu = Menu.buildFromTemplate(template);
    menu.popup({ window: BrowserWindow.fromWebContents(event.sender) });
  });
};
