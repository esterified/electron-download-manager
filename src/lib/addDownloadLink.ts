import { IpcMainEvent } from "electron";
import path from "path";
import { Worker } from "worker_threads";
import _initDownload from "./_initDownload";

export const downloadHandler = async (event: IpcMainEvent, url: string) => {
  await _initDownload(url, { action: "start" });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
function createWorker(d: any) {
  return new Promise(function (resolve, reject) {
    const worker = new Worker(path.join(__dirname, "worker.js"), {
      workerData: { d: d },
    });
    worker.on("message", (data) => {
      resolve(data);
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    worker.on("error", (err: any) => {
      reject(`An error ocurred: ${err.message}`);
    });
  });
}
