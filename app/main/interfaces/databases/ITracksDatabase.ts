import { Track } from '@shared/types/vimp';
import { IGenericDatabase } from './IGenericDatabase';

export interface ITracksDatabase extends IGenericDatabase<Track> {
  getByPath(trackPath: string): Promise<PouchDB.Core.ExistingDocument<object> | null>;
  incrementPlayCount(trackID: string): Promise<void>;
  updateFavorite(trackID: string): Promise<void>;
  updateLastPlayed(trackID: string): Promise<void>
}