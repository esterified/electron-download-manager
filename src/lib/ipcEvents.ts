import { IpcMainEvent, ipcMain } from 'electron';
import { downloadHandler } from './addDownloadLink';
import { getDownloadsHandler } from './getDownloads';
import { cancelDownloadHandler } from './cancelDownload';

export const initIPCEvents = () => {
  ipcMain.on('addDownloadLink', downloadHandler);
  ipcMain.handle('getDownloads', getDownloadsHandler);
  ipcMain.handle('cancelDownloadLink', cancelDownloadHandler);
};
