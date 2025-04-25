import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";
import is from "electron-is";
import { Loger } from "./loger";
import { app } from "electron";
const prodDBName = "prod.db";
const prodPath = path.join(process.resourcesPath, "", prodDBName);
const PrismaprodDBPath = is.dev()
  ? path.join(__dirname, "../../prisma", "dev.db")
  : copyDBtoUserFolderandgetPath(prodPath);
const PrismaDBFullPath = `file:${PrismaprodDBPath}`;
// Optional, initialize the logger for any renderer process
Loger.info("Log from the main process");
Loger.info("Log from the main process: PrismaprodDBPath->", PrismaDBFullPath);
console.log(is.dev(), "is.dev()");

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: PrismaDBFullPath,
    },
  },
});

function copyDBtoUserFolderandgetPath(dbSourcePath: string) {
  const userDataPath = app.getPath("userData");
  const dbDestinationPath = path.join(userDataPath, prodDBName);

  // Ensure the database exists in the user data directory
  if (!fs.existsSync(dbDestinationPath)) {
    fs.copyFileSync(dbSourcePath, dbDestinationPath);
  }
  Loger.info("Database copied from", dbSourcePath, "to", dbDestinationPath);
  return dbDestinationPath;
}

export default prisma;
