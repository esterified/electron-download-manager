import type { Download, Setting } from "./lowdb";
import { DownloaderHelper } from "node-downloader-helper";
import { GlobalMainWindow, GlobalSchedulerInstance } from "../main";
import { bytesToSize } from "../utils/convert";
import { getAllDownloads, updateDownload } from "../utils/download";
import { downloadTasks } from "./downloadQueue";
import { db } from "./lowdb";
import { Loger } from "./loger";

export default async (
  url: string,
  options:
    | { action: "start" }
    | { action: "resume"; id: number; filename: string },
) => {
  console.log("addDownloadLink", url);
  const settings = db.data?.settings || [];
  const globalDirectory = settings[0]?.globalDirectory;
  console.log("globalDirectory", globalDirectory);
  Loger.log("globalDirectory", globalDirectory);

  const downloader = new DownloaderHelper(
    url,
    globalDirectory,
    options.action == "start"
      ? {}
      : { fileName: options.filename, resumeIfFileExists: true },
  );

  const sizeRequest: { name: string; total: number | null } | null =
    await downloader.getTotalSize().catch((err: any): null => {
      console.log(err);
      return null;
    });
  const filesize = bytesToSize(sizeRequest?.total || 0);
  console.log("filesize: ", filesize);

  let download: Download | null = null;
  if (options.action == "start") {
    // Find max id for auto-increment
    const downloads = db.data?.downloads || [];
    const maxId =
      downloads.length > 0 ? Math.max(...downloads.map((d) => d.id)) : 0;
    download = {
      id: maxId + 1,
      url,
      filename: sizeRequest?.name,
      status: "downloading",
      filesize,
      percentage: 0,
      speed: "",
      filepath: "",
      tags: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.data.downloads.push(download);
    await db.write();
  } else {
    download = db.data?.downloads.find((d) => d.id === options.id) || null;
  }
  const allDownloads = await getAllDownloads();
  Loger.log("allDownloads", allDownloads.length);
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
