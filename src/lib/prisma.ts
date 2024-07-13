import { PrismaClient } from "@prisma/client";
import path from "path";
import is from "electron-is";
import { Loger } from "./loger";
const prodDBName = "prod.db";
const PrismaprodDBPath = is.dev()
  ? path.join(__dirname, "../../prisma", "dev.db")
  : path.join(process.resourcesPath, "", prodDBName);
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

export default prisma;
