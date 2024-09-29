import { BrowserWindow } from "electron";
import { IBaseModule } from "./IBaseModule";

export interface IBaseWindowModule extends IBaseModule {
  getWindow(): BrowserWindow;
}