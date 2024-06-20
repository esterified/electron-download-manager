import { Download } from '@prisma/client';
import { DownloaderHelper } from 'node-downloader-helper';

export interface IDownloadsUI extends Download {
  checked: boolean;
}
export interface IDownloads {
  id: number;
  url: string;
  downloader: DownloaderHelper;
  // status: 'downloading' | 'completed' | 'cancelled' | 'error';
}
