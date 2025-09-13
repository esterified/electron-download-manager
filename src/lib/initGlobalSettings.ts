import { app } from "electron";
import { db, initDB } from "./lowdb";

export const initGlobalSettings = async () => {
  await initDB();
  console.log("initGlobalSettings Done!");
};
