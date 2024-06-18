import Downloader from 'nodejs-file-downloader';

export interface IDownloads {
  url: string;
  downloader: Downloader;
  status: 'downloading' | 'downloaded' | 'cancelled' | 'error';
}
