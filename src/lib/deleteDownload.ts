import { IpcMainEvent } from 'electron';
import prisma from './prisma';
import { downloadTasks } from './downloadQueue';

//arrow function
export const deleteDownloadHandler = async (
  event: IpcMainEvent,
  id: number,
  url?: string
) => {
  const downloader = downloadTasks.find((a) => a.id === id)?.downloader;
  if (downloader) {
    downloader.pause();
    console.log(`download ID:${id} cancelled`);
  }
  await prisma.download.delete({
    where: {
      id: id,
    },
  });
  console.log(`download ID:${id} Deleted`);
};
