import { IpcMainEvent } from "electron";
import prisma from "./prisma";
import { updateDownload } from "../utils/download";
import { downloadTasks } from "./downloadQueue";

//arrow function
export const cancelDownloadHandler = async (
  event: IpcMainEvent,
  id: number,
) => {
  const downloader = downloadTasks.find((a) => a.id === id)?.downloader;
  if (downloader) {
    downloader.pause();
    console.log(`download ID:${id} cancelled`);
  }
};
