import { Download } from "@prisma/client";
import { DownloaderHelper } from "node-downloader-helper";
import { GlobalMainWindow, GlobalSchedulerInstance } from "../main";
import { bytesToSize } from "../utils/convert";
import { getAllDownloads, updateDownload } from "../utils/download";
import { downloadTasks } from "./downloadQueue";
import prisma from "./prisma";
import { app } from "electron";
import { Loger } from "./loger";

export default async (
  url: string,
  options:
    | { action: "start" }
    | { action: "resume"; id: number; filename: string },
) => {
  console.log("addDownloadLink", url);
  const appdatapath = app.getPath("downloads");
  console.log("appdatapath", appdatapath);
  Loger.log("appdatapath", appdatapath);

  const downloader = new DownloaderHelper(
    url,
    appdatapath,
    options.action == "start"
      ? {}
      : { fileName: options.filename, resumeIfFileExists: true },
  );

  const sizeRequest: { name: string; total: number | null } | null =
    await downloader.getTotalSize().catch((err) => {
      console.log(err);
      return null;
    });
  const filesize = bytesToSize(sizeRequest?.total || 0);
  console.log("filesize: ", filesize);

  const download: Download | null =
    options.action == "start"
      ? await prisma.download
          .create({
            data: {
              url: url,
              filename: sizeRequest?.name,
              status: "downloading",
              filesize: filesize,
              percentage: 0,
              speed: "",
            },
          })
          .catch(() => {
            console.log("failed to create download");
            return null;
          })
      : await prisma.download.findFirst({ where: { id: options.id } });
  const allDownloads = await getAllDownloads();
  GlobalMainWindow.webContents.send(
    "downloadCompleted",
    JSON.stringify(allDownloads),
  );
  options.action === "start" ? downloader.start() : downloader.resume();

  //Registering events
  downloader.on("progress.throttled", async ({ progress, speed }) => {
    await updateDownload({
      id: download?.id,
      percentage: parseInt(progress.toString()),
      speed: progress === 100 ? "" : bytesToSize(speed) + "/s",
    });
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  downloader.on("download", (info) => {
    downloadTasks.push({
      url,
      downloader,
      id: download?.id || 0,
    });
    if (GlobalMainWindow && !GlobalSchedulerInstance.getRunningStatus()) {
      GlobalSchedulerInstance.start();
    }
  });
  downloader.on("end", async (info) => {
    if (info.incomplete === false) {
      console.log("All done", info);
      await updateDownload({
        id: download?.id,
        status: "completed",
        filepath: info.filePath,
        speed: "",
      });
      downloadTasks.splice(
        downloadTasks.findIndex((a) => a.id === download?.id),
        1,
      );
      console.log("downloadTasks after", downloadTasks.length);
      const allDownloads = await getAllDownloads();
      GlobalMainWindow.webContents.send(
        "downloadCompleted",
        JSON.stringify(allDownloads),
      );
      return;
    }
  });
  downloader.on("renamed", async (info) => {
    console.log("renamed", info);
    await updateDownload({
      id: download?.id,
      filename: info.fileName,
    });
  });
  downloader.on("error", async (info) => {
    console.log("error", info.message);
    await updateDownload({
      id: download?.id,
      status: "error",
      speed: "",
    });
  });
};
