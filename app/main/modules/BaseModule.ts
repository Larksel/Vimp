import log from 'electron-log/main';
import { IBaseModule } from '@interfaces/modules/IBaseModule';

export default abstract class BaseModule implements IBaseModule {
  protected loaded: boolean;

  constructor() {
    this.loaded = false;
  }

  async init() {
    if (this.loaded)
      throw new TypeError(`Module ${this.constructor.name} is already loaded`);
    else {
      log.info(`Loading module: ${this.constructor.name}`);

      await this.load().catch((err) => {
        throw err;
      });
      this.loaded = true;
    }
  }

  protected abstract load(): Promise<void>;
}
