import { createMainLogger } from '@main/logger';
import { IBaseModule } from '@interfaces/modules/IBaseModule';

const logger = createMainLogger('Main');

export const init = async (...modules: IBaseModule[]): Promise<void> => {
  const results = await Promise.allSettled(
    modules.map((module) => {
      if (module.init) module.init();
    }),
  );

  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      logger.error(
        `An error occurred when loading ${modules[index].constructor.name} could not be loaded:\n${result.reason}`,
      );
    }
  });
};
