import { ScannedFiles } from '@shared/types/vimp';
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
  import(itemsPath: string[]): Promise<ScannedFiles | null>;
  //TODO método para escanear e importar tudo dos diretorios configurados
  //scanAndSave(pathsScan: string[]): Promise<>
}
