import { DownloaderHelper } from "node-downloader-helper";
import { Download } from "./lowdb";

export interface IDownloadsUI extends Download {
  checked: boolean;
}
export interface IDownloadTask {
  id: number;
  url: string;
  downloader: DownloaderHelper;
  // status: 'downloading' | 'completed' | 'cancelled' | 'error';
}
export type DownloadStatus = "downloading" | "completed" | "paused" | "error";
export type TPages = "home" | "setting";
