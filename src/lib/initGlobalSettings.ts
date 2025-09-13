import { app } from "electron";
import { db, initDB } from "./prisma";

export const initGlobalSettings = async () => {
  await initDB();
  console.log("initGlobalSettings Done!");
};
