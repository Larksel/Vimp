import { ITracksDatabase } from '../databases/ITracksDatabase';
import { IBaseWindowModule } from './IBaseWindowModule';
import { IPlaylistsDatabase } from '../databases/IPlaylistsDatabase';

export interface IDBManager extends IBaseWindowModule {
  getTracksDB(): ITracksDatabase;
  getPlaylistsDB(): IPlaylistsDatabase;
}
