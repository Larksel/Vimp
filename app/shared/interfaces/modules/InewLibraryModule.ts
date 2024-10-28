import { IBaseModule } from './IBaseModule';

export interface ILibraryModule extends IBaseModule {
  status: {
    processed: number;
    total: number;
  };

  scan(pathsScan: string[]): Promise<{
    paths: string[],
    files: string[],
  }>;
  import<T>(itemsPath: string[]): Promise<T[]>;
}
