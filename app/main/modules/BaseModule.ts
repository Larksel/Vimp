export default class Module {
  protected loaded: boolean;

  constructor() {
    this.loaded = false;
  }

  async init(): Promise<void> {
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

  async load(): Promise<void> {
    throw new TypeError(
      `Module ${this.constructor.name} needs a load() method`,
    );
  }
}
