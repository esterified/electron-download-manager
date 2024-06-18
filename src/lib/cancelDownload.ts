import { IpcMainEvent } from 'electron';
import { downloadProcesses } from './addDownloadLink';

//arrow function
export const cancelDownloadHandler = async (
  event: IpcMainEvent,
  url: string
) => {
  const downloader = downloadProcesses.find((a) => a.url === url)?.downloader;
  if (downloader) {
    downloader.cancel();
  }
};
