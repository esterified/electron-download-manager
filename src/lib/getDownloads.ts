import { IpcMainEvent } from "electron";
import { getAllDownloads } from "../utils/download";
import { Download } from "./prisma";

// arrow function
export const getDownloadsHandler = async (
  event: IpcMainEvent,
  url?: string,
) => {
  const download: Download[] = await getAllDownloads();
  return JSON.stringify(
    download.filter((a: Download) => (!url ? true : a.url === url)) || {},
  );
};
