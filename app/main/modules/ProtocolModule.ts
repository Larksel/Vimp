import { protocol } from 'electron';
import BaseModule from './BaseModule';

export default class ProtocolModule extends BaseModule {
  constructor() {
    super();
  }

  protected async load() {
    // Will not use protocol.handle, its buggy
    protocol.registerFileProtocol('vimp', (req, callback) => {
      const filePath = decodeURIComponent(req.url.slice('vimp://'.length));
      callback({ path: filePath });
    });
  }
}
