import GenericDatabase from '@databases/genericDB';
import { ITracksDatabase } from '@interfaces/databases/ITracksDatabase';
import IPCChannels from '@shared/constants/IPCChannels';
import { Track, TrackModel } from '@shared/types/vimp';
import { BrowserWindow } from 'electron';
import fs from 'fs';

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
    console.log('Verifying TracksDB');
    const tracks = await this.getAll();
    const lostTracks = tracks.filter((track) => !fs.existsSync(track.path));

    if (lostTracks.length > 0) {
      console.log(`Deleting ${lostTracks.length} missing tracks`)
      await this.delete(lostTracks);
    }

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
    this.window.webContents.send(IPCChannels.DB_HAS_CHANGED);
  }

  /**
   * Changes `favorite` for the given track
   */
  async updateFavorite(trackID: string) {
    const doc: TrackModel = await this.db.get(trackID);
    await this.db.put({
      ...doc,
      favorite: !doc.favorite,
    });
    this.window.webContents.send(IPCChannels.DB_HAS_CHANGED);
  }

  /**
   * Update `lastPlayed` to current time for the given track
   */
  async updateLastPlayed(trackID: string) {
    const doc = await this.db.get(trackID);
    await this.db.put({
      ...doc,
      lastPlayed: new Date(),
    });
    this.window.webContents.send(IPCChannels.DB_HAS_CHANGED);
  }
}
