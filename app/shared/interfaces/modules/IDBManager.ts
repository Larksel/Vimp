import { ITracksDatabase } from '@interfaces/databases/ITracksDatabase';
import { IBaseWindowModule } from './IBaseWindowModule';

export interface IDBManager extends IBaseWindowModule {
  getTracksDB(): ITracksDatabase;
}
