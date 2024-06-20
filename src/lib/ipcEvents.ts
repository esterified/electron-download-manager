import {
  IpcMainEvent,
  OpenDialogOptions,
  dialog,
  ipcMain,
  shell,
} from 'electron';
import { downloadHandler } from './addDownloadLink';
import { getDownloadsHandler } from './getDownloads';
import { cancelDownloadHandler } from './cancelDownload';
import { GlobalMainWindow } from '../main';

export const initIPCEvents = () => {
  ipcMain.on('addDownloadLink', downloadHandler);
  ipcMain.handle('getDownloads', getDownloadsHandler);
  ipcMain.handle('cancelDownloadLink', cancelDownloadHandler);
  ipcMain.handle(
    'openDir',
    async (
      event,
      props: OpenDialogOptions['properties'],
      defaultPath?: string
    ) => {
      const result = await dialog.showOpenDialog({
        title: 'Choose Folder',
        properties: props,
        defaultPath,
      });

      // GlobalMainWindow.webContents.send('open-file', result.filePaths[0]);
      if (result.canceled || result.filePaths.length < 1) {
        return undefined;
      }
      shell.openPath(result.filePaths[0]);

      return result.filePaths[0];
    }
  );
};
