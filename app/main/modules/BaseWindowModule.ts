import { BrowserWindow } from 'electron';
import BaseModule from './BaseModule';
import { IBaseWindowModule } from '@interfaces/modules/IBaseWindowModule';

export default class BaseWindowModule extends BaseModule implements IBaseWindowModule {
  protected window: BrowserWindow;

  constructor(window: BrowserWindow) {
    super();
    this.window = window;
  }

  getWindow(): BrowserWindow {
    return this.window;
  }
}
