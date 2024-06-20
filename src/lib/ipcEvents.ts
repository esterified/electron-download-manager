import { IpcMainEvent, dialog, ipcMain } from 'electron';
import { downloadHandler } from './addDownloadLink';
import { getDownloadsHandler } from './getDownloads';
import { cancelDownloadHandler } from './cancelDownload';
import { mainWindowGlobal } from '../main';

export const initIPCEvents = () => {
  ipcMain.on('addDownloadLink', downloadHandler);
  ipcMain.handle('getDownloads', getDownloadsHandler);
  ipcMain.handle('cancelDownloadLink', cancelDownloadHandler);
  ipcMain.handle('pickdir', async () => {
    const result = await dialog.showOpenDialog(mainWindowGlobal, {
      title: 'Choose Folder',
      properties: ['openDirectory'],
    });

    if (result.canceled || result.filePaths.length < 1) {
      return undefined;
    }

    return result.filePaths[0];
  });
};
