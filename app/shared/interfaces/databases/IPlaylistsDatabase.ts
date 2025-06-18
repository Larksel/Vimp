import { IGenericDatabase } from './IGenericDatabase';
import { Playlist } from '@shared/types/vimp';

export interface IPlaylistsDatabase extends IGenericDatabase<Playlist> {
  verifyPlaylistsTracks(): Promise<void>;
  incrementPlayCount(playlistID: string): Promise<void>;
  updateFavorite(playlistID: string): Promise<void>;
  updateLastPlayed(playlistID: string): Promise<void>;
}
