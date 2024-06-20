import { app, BrowserWindow, ipcMain } from 'electron';
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
