import log from 'electron-log/main';
import GenericDatabase from '@databases/genericDB';
import { IPlaylistsDatabase } from '@interfaces/databases/IPlaylistsDatabase';
import IPCChannels from '@shared/constants/IPCChannels';
import { Playlist, PlaylistModel } from '@shared/types/vimp';
import { BrowserWindow } from 'electron';
import { ITracksDatabase } from '@interfaces/databases/ITracksDatabase';

export default class PlaylistsDatabase
  extends GenericDatabase<Playlist>
  implements IPlaylistsDatabase
{
  protected readonly TracksDB: ITracksDatabase;

  constructor(window: BrowserWindow, TracksDB: ITracksDatabase) {
    super('PlaylistsDB', window);

    this.TracksDB = TracksDB;
  }

  protected async load() {
    await this.verifyPlaylistsTracks();
    await this.db.createIndex({
      index: {
        fields: ['_id'],
      },
    });
  }

  async verifyPlaylistsTracks() {
    log.info('[PlaylistsDB] Verifying playlists for missing track files');
    const allTracks = await this.TracksDB.getAll();
    const allPlaylists = await this.getAll();

    const updatedPlaylists = allPlaylists.map((playlist) => ({
      ...playlist,
      tracks: playlist.tracks.filter((id) => !!allTracks[id]),
    }));

    await this.db.bulkDocs(updatedPlaylists);
  }

  /**
   * Increments `playCount` attribute for the given playlist
   */
  async incrementPlayCount(playlistID: string) {
    const doc: PlaylistModel = await this.db.get(playlistID);
    await this.db.put({
      ...doc,
      playCount: doc.playCount + 1,
    });

    log.debug(
      `[PlaylistsDB] Play count incremented to ${doc.playCount + 1} for playlist: ${doc.title}`,
    );
    this.window.webContents.send(IPCChannels.DB_HAS_CHANGED);
  }

  /**
   * Changes `favorite` for the given playlist
   */
  async updateFavorite(playlistID: string) {
    const doc: PlaylistModel = await this.db.get(playlistID);
    const newFavoriteState = !doc.favorite;
    const dateFavorited = newFavoriteState ? new Date() : undefined;
    await this.db.put({
      ...doc,
      favorite: newFavoriteState,
      dateFavorited: dateFavorited,
    });

    log.debug(
      `[PlaylistsDB] Favorite status changed to ${newFavoriteState} for playlist: ${doc.title}`,
    );
    this.window.webContents.send(IPCChannels.DB_HAS_CHANGED);
  }

  /**
   * Update `lastPlayed` to current time for the given playlist
   */
  async updateLastPlayed(playlistID: string) {
    const doc: PlaylistModel = await this.db.get(playlistID);
    await this.db.put({
      ...doc,
      lastPlayed: new Date(),
    });

    log.debug(
      `[PlaylistsDB] Last played status updated for playlist: ${doc.title}`,
    );
    this.window.webContents.send(IPCChannels.DB_HAS_CHANGED);
  }
}
