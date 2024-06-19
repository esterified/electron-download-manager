import { IpcMainEvent } from 'electron';
import { downloadProcesses } from './addDownloadLink';
import prisma from './prisma';
import { Download } from '@prisma/client';

// arrow function
export const getDownloadsHandler = async (
  event: IpcMainEvent,
  url?: string
) => {
  const download: Download[] = await prisma.download.findMany({ take: 50 });
  return JSON.stringify(
    download.filter((a: Download) => (!url ? true : a.url === url)) || {}
  );
};
