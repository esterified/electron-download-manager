import { Download } from '@prisma/client';
import prisma from '../lib/prisma';

export const updateDownload = async ({
  id,
  status,
  ...args
}: Partial<Download> & {
  status?: 'downloading' | 'completed' | 'cancelled' | 'error';
}) => {
  await prisma.download.update({
    where: {
      id,
    },
    data: {
      status,
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
