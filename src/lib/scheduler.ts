import { BrowserWindow, webContents } from 'electron';
import prisma from './prisma';
import { downloadTasks } from './downloadQueue';
import { GlobalSchedulerInstance, mainWindowGlobal } from '../main';
import { getAllDownloads } from '../utils/download';

export class Scheduler {
  public callback: () => Promise<void>;
  private timeout: NodeJS.Timeout | null;
  private running: boolean;
  public delay: number;
  constructor(callback: () => Promise<void>) {
    this.callback = callback;
    this.delay = 2000;
    this.running = false;
  }

  getRunningStatus() {
    return this.running;
  }
  start() {
    // clear timeout if exists
    this.stop();
    this.running = true;
    const matchTime = async () => {
      await this.callback();
      if (this.running === false) {
        return;
      }
      this.timeout = setTimeout(matchTime, this.delay);
      // console.log(this.timeout);
    };
    matchTime();
  }

  stop() {
    this.running = false;
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = null;
  }
}

export const downloadProcessorCron = (mainWindow: BrowserWindow) => {
  return async () => {
    if (!downloadTasks.length) {
      console.log(
        'No download tasks length: ' + downloadTasks.length + ' >_',
        new Date()
      );
      console.log(
        'Exiting Scheduler...',
        GlobalSchedulerInstance.getRunningStatus()
      );
      GlobalSchedulerInstance.stop();
      return;
    }
    console.log(
      'running callback length: ' + downloadTasks.length + ' >_',
      new Date()
    );
    const allDownloads = await getAllDownloads();
    mainWindow.webContents.send(
      'downloadCompleted',
      JSON.stringify(allDownloads)
    );
  };
};
