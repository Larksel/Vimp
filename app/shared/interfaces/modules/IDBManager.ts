import { ITracksDatabase } from '@interfaces/databases/ITracksDatabase';
import { IBaseWindowModule } from './IBaseWindowModule';
import { IPlaylistsDatabase } from '@interfaces/databases/IPlaylistsDatabase';

export interface IDBManager extends IBaseWindowModule {
  getTracksDB(): ITracksDatabase;
  getPlaylistsDB(): IPlaylistsDatabase;
}
