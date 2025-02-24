import { IpcMainEvent, OpenDialogOptions, dialog, shell } from "electron";

export const openDirHandler = async (
  event: IpcMainEvent,
  props: OpenDialogOptions["properties"],
  defaultPath?: string,
  openFile?: boolean,
) => {
  if (openFile) {
    console.log("openFile");
    shell.openPath(defaultPath);
    return defaultPath;
  }
  const result = await dialog.showOpenDialog({
    title: "Choose Folder",
    properties: props,
    defaultPath,
  });

  if (result.canceled || result.filePaths.length < 1) {
    return undefined;
  }
  shell.openPath(result.filePaths[0]);

  return result.filePaths[0];
};
