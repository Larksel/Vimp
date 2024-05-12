import { BrowserWindow } from 'electron';
import Module from './BaseModule';

export default class ModuleWindow extends Module {
  protected window: BrowserWindow;

  constructor(window: BrowserWindow) {
    super();
    this.window = window;
  }

  getWindow(): BrowserWindow {
    return this.window;
  }
}
