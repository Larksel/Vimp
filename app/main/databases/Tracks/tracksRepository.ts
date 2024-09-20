import GenericDatabase from '@databases/genericDb';
import { Track, TrackModel } from '@shared/types/vimp';

class TracksRepository extends GenericDatabase<Track> {
  constructor() {
    super('TracksDB')

    this.db.createIndex({
      index: {
        fields: ['path'],
      },
    });
  }

  async getByPath(trackPath: string) {
    if (!trackPath) return null;
    const { docs } = await this.db.find({
      selector: { path: trackPath },
    });

    return docs[0];
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
  }
}

export default TracksRepository;