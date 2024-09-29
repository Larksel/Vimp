import { IBaseModule } from "@interfaces/modules/IBaseModule";

export default class BaseModule implements IBaseModule {
  protected loaded: boolean;

  constructor() {
    this.loaded = false;
  }

  async init() {
    if (this.loaded)
      throw new TypeError(`Module ${this.constructor.name} is already loaded`);
    else {
      console.log(`Loading module: ${this.constructor.name}`);

      await this.load().catch((err) => {
        throw err;
      });
      this.loaded = true;
    }
  }

  protected async load(): Promise<void> {
    throw new TypeError(
      `Module ${this.constructor.name} needs a load() method`,
    );
  }
}
