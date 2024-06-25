import { exposeInMainWorldObject } from "../src/preload";

export {};

declare global {
  interface Window {
    electronAPI: (typeof exposeInMainWorldObject)["electronAPI"];
  }
}


