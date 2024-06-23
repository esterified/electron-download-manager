import { BrowserWindow, Menu, ipcMain } from "electron";
import { downloadHandler } from "./addDownloadLink";
import { getDownloadsHandler } from "./getDownloads";
import { cancelDownloadHandler } from "./cancelDownload";
import { openDirHandler } from "./openDirHandler";
import {
  deleteDownloadHandler,
  pauseDownloadHandler,
  playDownloadHandler,
} from "./bulkOperations";
import { showSettingsMenu } from "./showSettingsMenu";

// Main processes
export const initIPCEvents = () => {
  ipcMain.on("addDownloadLink", downloadHandler);
  ipcMain.on("bulkDeleteDownload", deleteDownloadHandler);
  ipcMain.on("bulkPlayDownload", playDownloadHandler);
  ipcMain.on("bulkPauseDownload", pauseDownloadHandler);
  ipcMain.handle("getDownloads", getDownloadsHandler);
  ipcMain.handle("cancelDownloadLink", cancelDownloadHandler);
  ipcMain.handle("openDir", openDirHandler);
  ipcMain.on("showSettingsMenu", showSettingsMenu);
};
