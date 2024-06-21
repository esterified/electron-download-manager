import { ipcRenderer, OpenDialogOptions } from 'electron';

export const ipcRendererEventsElectronApi = {
  addDownloadLink: (url: string) => ipcRenderer.send('addDownloadLink', url),
  getDownloads: (url?: string) => ipcRenderer.invoke('getDownloads', url),
  cancelDownloadLink: (id: number) =>
    ipcRenderer.invoke('cancelDownloadLink', id),
  onDownloadCompleted: (callback: (v: string) => void) =>
    ipcRenderer.on('downloadCompleted', (_event, v) => callback(v)),
  openDir: (props: OpenDialogOptions['properties'], defaultPath?: string) =>
    ipcRenderer.invoke('openDir', props, defaultPath),
  bulkDeleteDownload: (ids: number[]) =>
    ipcRenderer.send('bulkDeleteDownload', ids),
  bulkPauseDownload: (ids: number[]) =>
    ipcRenderer.send('bulkPauseDownload', ids),
  bulkPlayDownload: (ids: number[]) =>
    ipcRenderer.send('bulkPlayDownload', ids),
};
