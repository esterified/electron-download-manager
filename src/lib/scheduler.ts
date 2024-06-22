import { BrowserWindow, app } from 'electron';
import { downloadTasks } from './downloadQueue';
import { GlobalSchedulerInstance } from '../main';
import { getDownloadsbyIds } from '../utils/download';

export class Scheduler {
  public callback: () => Promise<void>;
  private timeout: NodeJS.Timeout | null;
  private running: boolean;
  public delay: number;
  private startTime: number;
  constructor(callback: () => Promise<void>) {
    this.callback = callback;
    this.delay = 1000;
    this.running = false;
  }

  getRunningStatus() {
    return this.running;
  }
  start() {
    // clear timeout if exists
    this.stop();
    this.running = true;
    this.startTime = Date.now();
    const matchTime = async () => {
      await this.callback();
      if (this.running === false) {
        return;
      }
      this.timeout = setTimeout(matchTime, this.delay);
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
      const bounceid = app.dock.bounce();
      GlobalSchedulerInstance.stop();
      await new Promise((r) => setTimeout(r, 2000));
      if (bounceid) app.dock.cancelBounce(bounceid);
      return;
    }
    console.log(
      'running callback length: ' + downloadTasks.length + ' >_',
      new Date()
    );

    const allDownloads = await getDownloadsbyIds(
      downloadTasks.map((a) => a.id)
    );
    mainWindow.webContents.send(
      'downloadRealtimeSync',
      JSON.stringify(allDownloads)
    );
  };
};
