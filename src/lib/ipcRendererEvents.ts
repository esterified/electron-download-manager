import { ipcRenderer, OpenDialogOptions } from "electron";

export const ipcRendererEventsElectronApi = {
  addDownloadLink: (url: string) => ipcRenderer.send("addDownloadLink", url),
  showSettingsMenu: (page?: string) =>
    ipcRenderer.send("showSettingsMenu", page),
  getDownloads: (url?: string) => ipcRenderer.invoke("getDownloads", url),
  cancelDownloadLink: (id: number) =>
    ipcRenderer.invoke("cancelDownloadLink", id),
  openDir: (
    props: OpenDialogOptions["properties"],
    defaultPath?: string,
    openFile?: boolean,
  ) => ipcRenderer.invoke("openDir", props, defaultPath, openFile),
  bulkDeleteDownload: (ids: number[]) =>
    ipcRenderer.send("bulkDeleteDownload", ids),
  bulkPauseDownload: (ids: number[]) =>
    ipcRenderer.send("bulkPauseDownload", ids),
  bulkPlayDownload: (ids: number[]) =>
    ipcRenderer.send("bulkPlayDownload", ids),
  onDownloadCompleted: (callback: (v: string) => void) =>
    ipcRenderer.on("downloadCompleted", (_event, v) => callback(v)),
  onDownloadRealtimeSync: (callback: (v: string) => void) =>
    ipcRenderer.on("downloadRealtimeSync", (_event, v) => callback(v)),
  onOpenSettings: (callback: (v: string) => void) =>
    ipcRenderer.on("openSettings", (_event, v) => callback(v)),
};
