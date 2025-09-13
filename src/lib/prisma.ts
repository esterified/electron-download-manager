import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import path from "path";
import fs from "fs";
import is from "electron-is";
import { Loger } from "./loger";
import { app } from "electron";
const prodDBName = "prod.json";
const prodPath = path.join(process.resourcesPath, "", prodDBName);
const PrismaprodDBPath = is.dev()
  ? path.join(__dirname, "../../db", "dev.json")
  : prodPath;
const dbFilePath = PrismaprodDBPath;
// Optional, initialize the logger for any renderer process
Loger.info("Log from the main process");
Loger.info("Log from the main process: dbFilePath->", dbFilePath);
console.log(is.dev(), "is.dev()");

export type Download = {
  id: number;
  url: string;
  status: string;
  filename?: string;
  filesize?: string;
  speed?: string;
  percentage: number;
  filepath?: string;
  tags: string;
  createdAt: string;
  updatedAt: string;
};

export type Setting = {
  id: number;
  globalDirectory: string;
  createdAt: string;
  updatedAt: string;
};

type Data = {
  downloads: Download[];
  settings: Setting[];
};
const appdatapath = app.getPath("downloads");
const defaultData: Data = {
  downloads: [],
  settings: [
    {
      id: 1,
      globalDirectory: appdatapath,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
};
async function initDB() {
  await db.read();
  if (!db.data) db.data = defaultData;
  return db;
}
const adapter = new JSONFile<Data>(dbFilePath);
const db = new Low<Data>(adapter, defaultData);

// function copyDBtoUserFolderandgetPath(dbSourcePath: string) {
//   const userDataPath = app.getPath("userData");
//   const dbDestinationPath = path.join(userDataPath, prodDBName);

//   // Ensure the database exists in the user data directory
//   if (!fs.existsSync(dbDestinationPath)) {
//     fs.copyFileSync(dbSourcePath, dbDestinationPath);
//   }
//   Loger.info("Database copied from", dbSourcePath, "to", dbDestinationPath);
//   return dbDestinationPath;
// }

export { db, initDB };
