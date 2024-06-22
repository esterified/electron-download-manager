import { app, BrowserWindow, ipcMain, Menu, nativeImage, Tray } from 'electron';
import path from 'path';
import { initIPCEvents } from './lib/ipcEvents';
import { downloadProcessorCron, Scheduler } from './lib/scheduler';
import { initGlobalSettings } from './lib/initGlobalSettings';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}
export let GlobalMainWindow: BrowserWindow | null = null;
export let GlobalSchedulerInstance: InstanceType<typeof Scheduler> | null =
  null;
const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1440,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      //! enable for worker multithreading => https://www.electronjs.org/docs/latest/tutorial/multithreading
      // nodeIntegrationInWorker: true,
    },
    titleBarStyle: 'hidden',
  });

  console.log(
    'MAIN_WINDOW_VITE_DEV_SERVER_URL',
    MAIN_WINDOW_VITE_DEV_SERVER_URL
  );
  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }
  GlobalMainWindow = mainWindow;
  GlobalSchedulerInstance = new Scheduler(
    downloadProcessorCron(GlobalMainWindow)
  );
  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  initTray();
  initIPCEvents();
  createWindow();
  initGlobalSettings();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

const initTray = () => {
  const icon = nativeImage.createFromDataURL(
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAARdJREFUOE+lkjtKBUEQRc8VQw1ExMBfIC7ABbzATExFlyCGrkRM5e3AxEQMTTR2BQriD0TBQMzEkivV4JuZfgxYSUH37XPr0+Kfoa73ETEJzAPOji/gRZLzSNQAC8AJsJTqR2BXknMvwApw2QAMJN31BdjZAIMc94ABzvUKImIGmAZKC4upfgZ2ALfwIem9UEZmEBHrwBGwBsw1hvgK3AAHkq47AT6MiC3gGCjuRfsE7Es6+9tDbQubCVlO8UM+Pu81xKzEkCFgkz1JrcfWdVZQXCJiwxpJF03n2hBngSmPIgXfmScy2/BT0lsLEBG+PAS28+t2mfprn+Ymfk2aaxwAq0BxbkJcyS1wJakNqPU57nzsEPsAfwCE71IRtv4GYwAAAABJRU5ErkJggg=='
  );

  const tray = new Tray(icon);

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show main window', type: 'normal' },
    { type: 'separator' },
    { label: 'About Electron Download Manager', type: 'normal' },
    { label: 'Quit', type: 'normal', click: () => app.quit() },
  ]);

  tray.setToolTip('This is my application.');
  tray.setContextMenu(contextMenu);
};
