// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { OpenDialogOptions, contextBridge, ipcRenderer } from 'electron';

export const exposeInMainWorldObject = {
  electronAPI: {
    addDownloadLink: (url: string) => ipcRenderer.send('addDownloadLink', url),
    getDownloads: (url?: string) => ipcRenderer.invoke('getDownloads', url),
    cancelDownloadLink: (id: number) =>
      ipcRenderer.invoke('cancelDownloadLink', id),
    onDownloadCompleted: (callback: (v: string) => void) =>
      ipcRenderer.on('downloadCompleted', (_event, v) => callback(v)),
    openDir: (props: OpenDialogOptions['properties'], defaultPath?: string) =>
      ipcRenderer.invoke('openDir', props, defaultPath),
  },
};
for (const key of Object.entries(exposeInMainWorldObject)) {
  contextBridge.exposeInMainWorld(...key);
}
