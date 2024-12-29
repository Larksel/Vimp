import { BrowserWindow } from 'electron';
import BaseModule from './BaseModule';
import { IBaseWindowModule } from '@interfaces/modules/IBaseWindowModule';

export default abstract class BaseWindowModule
  extends BaseModule
  implements IBaseWindowModule
{
  protected window: BrowserWindow;

  constructor(window: BrowserWindow) {
    super();
    this.window = window;
  }

  /**
   * Returns the window used by the module
   */
  getWindow(): BrowserWindow {
    return this.window;
  }
}
