import { IpcMainInvokeEvent } from 'electron';
import { Track } from '@shared/types/vimp';
import { IBaseModule } from './IBaseModule';

export interface ILibraryModule extends IBaseModule {
  import: {
    processed: number;
    total: number;
  };

  importTracks(_: IpcMainInvokeEvent, tracksPath: string[]): Promise<Track[]>;
}
