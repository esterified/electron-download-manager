import { Download } from '@prisma/client';
import prisma from '../lib/prisma';
import { DownloadStatus } from '../lib/types';

export const updateDownload = async ({
  id,
  ...args
}: Partial<Download> & { status?: DownloadStatus }) => {
  await prisma.download.update({
    where: {
      id,
    },
    data: {
      ...args,
    },
  });
};

export const getAllDownloads = async () => {
  const download = await prisma.download.findMany({
    take: 50,
    orderBy: {
      createdAt: 'desc',
    },
  });
  return download as Download[];
};
export const getDownloadsbyIds = async (ids: number[]) => {
  const download = await prisma.download.findMany({
    take: 50,
    where: {
      id: {
        in: ids,
      },
    },
  });
  return download as Download[];
};
