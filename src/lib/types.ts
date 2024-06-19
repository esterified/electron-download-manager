import { Download } from '@prisma/client';
import Downloader from 'nodejs-file-downloader';

export interface IDownloadsUI extends Download {
  checked: boolean;
}
export interface IDownloads {
  id: number;
  url: string;
  downloader: Downloader;
  status: 'downloading' | 'downloaded' | 'cancelled' | 'error';
}
