// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge } from "electron";
import { ipcRendererEventsElectronApi } from "./lib/ipcRendererEvents";

export const exposeInMainWorldObject = {
  electronAPI: ipcRendererEventsElectronApi,
};
for (const key of Object.entries(exposeInMainWorldObject)) {
  contextBridge.exposeInMainWorld(...key);
}
