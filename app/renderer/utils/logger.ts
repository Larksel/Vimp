import log from 'electron-log/renderer';

export function createRendererLogger(moduleName: string) {
  return {
    info: (message: string) => log.info(`[${moduleName}] ${message}`),
    error: (message: string) => log.error(`[${moduleName}] ${message}`),
    warn: (message: string) => log.warn(`[${moduleName}] ${message}`),
    debug: (message: string) => log.debug(`[${moduleName}] ${message}`),
  };
}
