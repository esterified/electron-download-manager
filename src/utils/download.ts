import { Download } from "@prisma/client";
import { db } from "../lib/prisma";
import { DownloadStatus } from "../lib/types";

export const updateDownload = async ({
  id,
  ...args
}: Partial<Download> & { status?: DownloadStatus }) => {
  db.data.downloads = db.data.downloads.map((d) => {
    const createdAt = String(d.createdAt);
    const updatedAt = String(d.updatedAt);
    if (d.id === id) {
      const updated = { ...d, ...args, createdAt, updatedAt };
      return updated;
    }
    return { ...d, createdAt, updatedAt };
  });
  await db.write();
};

export const getAllDownloads = async () => {
  return db.data.downloads
    .slice()
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    })
    .slice(0, 50);
};
export const getDownloadsbyIds = async (ids: number[]) => {
  return db.data.downloads.filter((d) => ids.includes(d.id)).slice(0, 50);
};
