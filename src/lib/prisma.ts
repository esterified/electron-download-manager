import { PrismaClient } from "@prisma/client";
import path from "path";
import is from "electron-is";
import { Loger } from "./loger";
const localDBName = "mydb.db";
const PrismaLocalDBPath = is.dev()
  ? path.join(__dirname, "../../prisma", localDBName)
  : path.join(process.resourcesPath, "", localDBName);
export const PrismaDBFullPath = `file:${PrismaLocalDBPath}`;
// Optional, initialize the logger for any renderer process
Loger.info("Log from the main process");
Loger.info("Log from the main process->", PrismaLocalDBPath);
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: `file:${PrismaLocalDBPath}`,
    },
  },
});

export default prisma;
