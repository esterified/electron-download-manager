import { IpcMainEvent } from 'electron';
import prisma from './prisma';
import { Download } from '@prisma/client';
import { getAllDownloads } from '../utils/download';

// arrow function
export const getDownloadsHandler = async (
  event: IpcMainEvent,
  url?: string
) => {
  const download: Download[] = await getAllDownloads();
  return JSON.stringify(
    download.filter((a: Download) => (!url ? true : a.url === url)) || {}
  );
};
