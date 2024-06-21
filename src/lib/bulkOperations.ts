import { IpcMainEvent } from 'electron';
import prisma from './prisma';
import { downloadTasks } from './downloadQueue';
import { GlobalMainWindow } from '../main';
import { getAllDownloads } from '../utils/download';
import { DownloadStatus } from './types';

//arrow function
export const deleteDownloadHandler = async (
  event: IpcMainEvent,
  ids: number[]
) => {
  console.log(ids);
  ids.forEach((id) => {
    const task = downloadTasks.find((d) => d.id === id);
    if (task) {
      task.downloader?.stop();
    }
  });

  await prisma.download.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
  console.log(`download ID:${ids} Deleted`);
  const allDownloads = await getAllDownloads();
  GlobalMainWindow.webContents.send(
    'downloadCompleted',
    JSON.stringify(allDownloads)
  );
};

export const pauseDownloadHandler = async (
  event: IpcMainEvent,
  ids: number[]
) => {
  console.log(ids);
  if (!downloadTasks.length) return;
  ids.forEach((id) => {
    const task = downloadTasks.find((d) => d.id === id);
    if (task) {
      task.downloader?.pause();
    }
  });

  await prisma.download.updateMany({
    where: {
      id: {
        in: ids,
      },
    },
    data: {
      status: 'paused' as DownloadStatus,
    },
  });
  console.log(`download ID:${ids} Deleted`);
  const allDownloads = await getAllDownloads();
  GlobalMainWindow?.webContents.send(
    'downloadCompleted',
    JSON.stringify(allDownloads)
  );
};
export const playDownloadHandler = async (
  event: IpcMainEvent,
  ids: number[]
) => {
  console.log(ids);
  if (!downloadTasks.length) return;
  ids.forEach((id) => {
    const task = downloadTasks.find((d) => d.id === id);
    if (task) {
      task.downloader?.resume();
    }
  });

  await prisma.download.updateMany({
    where: {
      id: {
        in: ids,
      },
    },
    data: {
      status: 'downloading' as DownloadStatus,
    },
  });
  console.log(`download ID:${ids} Deleted`);
  const allDownloads = await getAllDownloads();
  GlobalMainWindow?.webContents.send(
    'downloadCompleted',
    JSON.stringify(allDownloads)
  );
};
