import { IpcMainEvent } from 'electron';
import { Downloader } from 'nodejs-file-downloader';
import path from 'path';
import { Worker } from 'worker_threads';
import { IDownloads } from './types';
import prisma from './prisma';
import { bytesToSize } from '../utils/convert';

export const downloadProcesses: IDownloads[] = [];
export const downloadHandler = async (event: IpcMainEvent, url: string) => {
  console.log('addDownloadLink', url);

  //get filename from url
  const filename = path.basename(url);
  const resSize = await fetch(url).then((res) => {
    const ln = res.headers.get('content-length');
    return res.ok && ln ? ln : '0';
  });
  const filesize = bytesToSize(+resSize);

  console.log('filesize: ', filesize);
  const download = await prisma.download
    .create({
      data: {
        url: url,
        filename: filename,
        status: 'downloading',
        filesize: filesize,
        percentage: 0,
      },
    })
    .catch(() => {
      console.log('failed to create download');
      return null;
    });

  console.log(download);
  const downloader = new Downloader({
    url: url,
    directory: './downloads',
    onProgress: async function (percentage, chunk, remainingSize) {
      // console.log('% ', percentage);
      // const convertedremainingSize = bytesToSize(remainingSize);
      // console.log('Remaining data: ', convertedremainingSize);
      await prisma.download.update({
        data: {
          percentage: parseInt(percentage),
        },
        where: {
          url: url,
        },
      });
    },
  });
  const index = downloadProcesses.length;
  downloadProcesses.push({
    url,
    downloader,
    status: 'downloading',
    id: download?.id || 0,
  });
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
  const allDownloads = await prisma.download.findMany({ take: 50 });
  event.sender.send('downloadCompleted', JSON.stringify(allDownloads));
};

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
