import { createMainLogger } from '@main/logger';
import GenericDatabase from '@databases/genericDB';
import { ITracksDatabase } from '@interfaces/databases/ITracksDatabase';
import IPCChannels from '@shared/constants/IPCChannels';
import { Track, TrackModel } from '@shared/types/vimp';
import { BrowserWindow } from 'electron';
import fs from 'fs';

const logger = createMainLogger('TracksDB');

export default class TracksDatabase
  extends GenericDatabase<Track>
  implements ITracksDatabase
{
  constructor(window: BrowserWindow) {
    super('TracksDB', window);
  }

  protected async load() {
    await this.verifyTracksDB();
    await this.db.createIndex({
      index: {
        fields: ['path'],
      },
    });
  }

  /**
   * Verifies whether tracks stored in the database still exist on the device's
   * file system and removes any tracks from the database that are no longer
   * present on the device.
   */
  async verifyTracksDB() {
    logger.info(`Verifying TracksDB for missing track files`);
    const tracks = await this.getAll();
    const lostTracks = tracks.filter((track) => !fs.existsSync(track.path));

    if (lostTracks.length > 0) {
      logger.info(`Found ${lostTracks.length} missing tracks. Removing...`);
      await this.delete(lostTracks);
    } else {
      logger.info(`No missing tracks found`);
    }

    logger.info(`Verification complete`);
    return lostTracks;
  }

  async getByPath(trackPath: string) {
    if (!trackPath) return null;
    const { docs } = await this.db.find({
      selector: { path: trackPath },
    });

    return docs[0] as TrackModel;
  }

  /**
   * Increments `playCount` attribute for the given track
   */
  async incrementPlayCount(trackID: string) {
    const doc: TrackModel = await this.db.get(trackID);
    await this.db.put({
      ...doc,
      playCount: doc.playCount + 1,
    });

    logger.debug(
      `Play count incremented to ${doc.playCount + 1} for track: ${doc.title}`,
    );
    this.window.webContents.send(IPCChannels.DB_HAS_CHANGED);
  }

  /**
   * Changes `favorite` for the given track
   */
  async updateFavorite(trackID: string) {
    const doc: TrackModel = await this.db.get(trackID);
    const newFavoriteState = !doc.favorite;
    const dateFavorited = newFavoriteState ? new Date() : undefined;
    await this.db.put({
      ...doc,
      favorite: newFavoriteState,
      dateFavorited: dateFavorited,
    });

    logger.debug(
      `Favorite status changed to ${newFavoriteState} for track: ${doc.title}`,
    );
    this.window.webContents.send(IPCChannels.DB_HAS_CHANGED);
  }

  /**
   * Update `lastPlayed` to current time for the given track
   */
  async updateLastPlayed(trackID: string) {
    const doc: TrackModel = await this.db.get(trackID);
    await this.db.put({
      ...doc,
      lastPlayed: new Date(),
    });

    logger.debug(`Last played status updated for track: ${doc.title}`);
    this.window.webContents.send(IPCChannels.DB_HAS_CHANGED);
  }
}
