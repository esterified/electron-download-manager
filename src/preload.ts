// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';

export const exposeInMainWorldObject = {
  electronAPI: {
    addDownloadLink: (url: string) => ipcRenderer.send('addDownloadLink', url),
  },
};
for (const key of Object.entries(exposeInMainWorldObject)) {
  contextBridge.exposeInMainWorld(...key);
}
