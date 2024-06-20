import { IpcMainEvent } from 'electron';
import path from 'path';
import { Worker } from 'worker_threads';
import prisma from './prisma';
import { bytesToSize } from '../utils/convert';
import { Download } from '@prisma/client';
import { getAllDownloads, updateDownload } from '../utils/download';
import { DownloaderHelper } from 'node-downloader-helper';
import { downloadTasks } from './downloadQueue';
import { GlobalSchedulerInstance, mainWindowGlobal } from '../main';

export const downloadHandler = async (event: IpcMainEvent, url: string) => {
  console.log('addDownloadLink', url);

  const downloader = new DownloaderHelper(url, './downloads');

  const sizeRequest: { name: string; total: number | null } | null =
    await downloader.getTotalSize().catch((err) => {
      console.log(err);
      return null;
    });
  const filesize = bytesToSize(sizeRequest?.total || 0);
  console.log('filesize: ', filesize);

  const download: Download | null = await prisma.download
    .create({
      data: {
        url: url,
        filename: sizeRequest?.name,
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
  downloader.start();
  downloader.on('progress.throttled', async ({ progress, speed }) => {
    await prisma.download.update({
      data: {
        percentage: parseInt(progress.toString()),
        speed: progress === 100 ? '' : bytesToSize(speed) + '/s',
      },
      where: {
        id: download.id,
      },
    });
  });
  // const index = downloadTasks.length;
  downloader.on('download', () => {
    downloadTasks.push({
      url,
      downloader,
      id: download?.id || 0,
    });
    if (mainWindowGlobal && !GlobalSchedulerInstance.getRunningStatus()) {
      GlobalSchedulerInstance.start();
    }
  });
  downloader.on('end', async (info) => {
    if (info.incomplete === false) {
      console.log('All done', info);
      await updateDownload({
        id: download?.id,
        status: 'completed',
        filepath: info.filePath,
        speed: '',
      });
      downloadTasks.splice(
        downloadTasks.findIndex((a) => a.id === download?.id),
        1
      );
      console.log('downloadTasks after', downloadTasks.length);
      const allDownloads = await getAllDownloads();
      event.sender.send('downloadCompleted', JSON.stringify(allDownloads));
      return;
    }
  });
  downloader.on('error', async (info) => {
    console.log('error', info.message);
    await updateDownload({
      id: download?.id,
      status: 'error',
      speed: '',
    });
  });
};

function createWorker(d: any) {
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
