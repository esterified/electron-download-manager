import prisma from "./prisma";

export const initGlobalSettings = async () => {
  const settingExist = await prisma.setting.findFirst();
  if (!settingExist)
    await prisma.setting.create({
      data: {
        globalDirectory: "./downloads",
      },
    });

  console.log("initGlobalSettings");
};
