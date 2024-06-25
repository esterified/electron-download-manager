import { app } from "electron";
import prisma from "./prisma";

export const initGlobalSettings = async () => {
  const appdatapath = app.getPath("downloads");
  const settingExist = await prisma.setting.findFirst();
  if (!settingExist)
    await prisma.setting.create({
      data: {
        globalDirectory: appdatapath,
      },
    });

  console.log("initGlobalSettings");
};
