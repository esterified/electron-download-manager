import { IpcMainEvent } from 'electron';
import { Downloader } from 'nodejs-file-downloader';
import path from 'path';
import { Worker } from 'worker_threads';
import { IDownloads } from './types';

function createWorker(d: Downloader) {
  return new Promise(function (resolve, reject) {
    const worker = new Worker(path.join(__dirname, 'worker.js'), {
      workerData: { d: d },
    });
    worker.on('message', (data) => {
      resolve(data);
    });
    worker.on('error', (err: any) => {
      reject(`An error ocurred: ${err.message}`);
    });
  });
}
export const downloadProcesses: IDownloads[] = [];
export const downloadHandler = async (event: IpcMainEvent, url: string) => {
  console.log('addDownloadLink', url);
  const downloader = new Downloader({
    url: url,
    directory: './downloads',
    onProgress: function (percentage, chunk, remainingSize) {
      //Gets called with each chunk.
      console.log('% ', percentage);
      // console.log('Current chunk of data: ', chunk);
      const convertedremainingSize =
        remainingSize > 1024 * 1024
          ? `${remainingSize / 1024 / 1024}mb`
          : remainingSize > 1024
          ? `${remainingSize / 1024}kb`
          : `${remainingSize} bytes`;
      console.log('Remaining data: ', convertedremainingSize);
    },
  });
  const index = downloadProcesses.length;
  downloadProcesses.push({ url, downloader, status: 'downloading' });
  try {
    const { filePath, downloadStatus } = await downloader.download(); //Downloader.download() resolves with some useful properties.

    console.log('All done', downloadStatus);
    downloadProcesses[index].status = 'downloaded';
  } catch (error: any) {
    console.log('Download failed', error.message);
    if (error.code === 'ERR_REQUEST_CANCELLED') {
      downloadProcesses[index].status = 'cancelled';
    } else {
      downloadProcesses[index].status = 'error';
    }
  }
  console.log('downloadProcesses', downloadProcesses.length);
  console.log('downloadProcesses after', downloadProcesses.length);
  event.sender.send(
    'downloadCompleted',
    JSON.stringify(
      downloadProcesses.map((a) => {
        const { downloader, ...t } = a;
        return t;
      })
    )
  );
};
