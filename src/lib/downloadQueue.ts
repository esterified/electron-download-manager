import { IDownloadTask } from "./types";

// Memory based queue
export const downloadTasks: IDownloadTask[] = [];

export const removeDownloadTaskbyIds = (ids: number[]) => {
  for (const id of ids) {
    const indx = downloadTasks.findIndex((d) => d.id === id);
    downloadTasks.splice(indx, 1);
  }
};
