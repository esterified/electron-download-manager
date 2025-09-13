import { IpcMainEvent } from "electron";
import { db } from "./prisma";
import { downloadTasks, removeDownloadTaskbyIds } from "./downloadQueue";
import { GlobalMainWindow } from "../main";
import { getAllDownloads } from "../utils/download";
import { DownloadStatus } from "./types";
import _initDownload from "./_initDownload";

//arrow function
export const deleteDownloadHandler = async (
  event: IpcMainEvent,
  ids: number[],
) => {
  console.log(ids);
  ids.forEach((id) => {
    const task = downloadTasks.find((d) => d.id === id);
    if (task) {
      task.downloader?.stop();
    }
  });
  removeDownloadTaskbyIds(ids);
  db.data.downloads = db.data.downloads.filter((d) => !ids.includes(d.id));
  await db.write();
  console.log(`download ID:${ids} Deleted`);
  const allDownloads = await getAllDownloads();
  GlobalMainWindow.webContents.send(
    "downloadCompleted",
    JSON.stringify(allDownloads),
  );
};

export const pauseDownloadHandler = async (
  event: IpcMainEvent,
  ids: number[],
) => {
  console.log(ids);
  if (!downloadTasks.length) return;
  ids.forEach((id) => {
    const task = downloadTasks.find((d) => d.id === id);
    if (task) {
      task.downloader?.pause();
    }
  });
  removeDownloadTaskbyIds(ids);
  db.data.downloads = db.data.downloads.map((d) =>
    ids.includes(d.id) ? { ...d, status: "paused" as DownloadStatus } : d,
  );
  await db.write();
  console.log(`download ID:${ids} Deleted`);
  const allDownloads = await getAllDownloads();
  GlobalMainWindow?.webContents.send(
    "downloadCompleted",
    JSON.stringify(allDownloads),
  );
};
export const playDownloadHandler = async (
  event: IpcMainEvent,
  ids: number[],
) => {
  console.log(ids);

  ids.forEach(async (id) => {
    const dl = db.data.downloads.find((d) => d.id === id);
    if (dl) {
      await _initDownload(dl.url, {
        action: "resume",
        id: dl.id,
        filename: dl.filename,
      });
    }
  });
};
