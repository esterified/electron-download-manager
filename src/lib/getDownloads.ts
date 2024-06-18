import { IpcMainEvent } from 'electron';
import { downloadProcesses } from './addDownloadLink';

// arrow function
export const getDownloadsHandler = async (
  event: IpcMainEvent,
  url?: string
) => {
  return JSON.stringify(
    downloadProcesses
      .filter((a) => (!url ? true : a.url === url))
      .map((a: (typeof downloadProcesses)[0]) => {
        const { downloader, ...t } = a;
        return t;
      }) || {}
  );
};
