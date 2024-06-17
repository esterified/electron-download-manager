import { IpcMainEvent, ipcMain } from 'electron';
import { downloadHandler } from './addDownloadLink';

export const initIPCEvents = () => {
  ipcMain.on('addDownloadLink', downloadHandler);
};
