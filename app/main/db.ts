import path from 'path';
import { app } from 'electron';
import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import { Track, TrackModel } from '@shared/types/vimp';

PouchDB.plugin(PouchDBFind);

const userDataPath = app.getPath('userData');

const Tracks = new PouchDB<Track>(path.join(userDataPath, 'TracksDB'), {
  adapter: 'leveldb',
  auto_compaction: true,
});

Tracks.createIndex({
  index: {
    fields: ['path'],
  },
});

const TracksDB = {
  // * CRUD operations

  async insertMany(tracks: Track[]) {
    const datedTracks = tracks.map((track) => ({
      ...track,
      dateAdded: new Date(),
    }));

    return Tracks.bulkDocs(datedTracks);
  },

  //TODO pegar pedaços ao invés de tudo direto
  async getAll() {
    const [firstResponse, secondResponse] = await Promise.all([
      Tracks.allDocs({ include_docs: true, endkey: '_design' }),
      Tracks.allDocs({ include_docs: true, startkey: '_design\uffff' }),
    ]);

    const tracks = [...firstResponse.rows, ...secondResponse.rows]
      .map((record) => record.doc)
      .filter(Boolean);

    return tracks;
  },

  //TODO updateMany
  async update(track: TrackModel) {
    const doc = await Tracks.get(track._id);

    return Tracks.put({ ...doc, ...track, dateModified: new Date() });
  },

  async delete(trackID: string): Promise<void> {
    const { docs } = await Tracks.find({
      selector: { _id: trackID },
    });
    const tracks = docs;
    const deletedTracks = tracks.map((track) => ({
      ...track,
      _deleted: true,
    }));

    await Tracks.bulkDocs(deletedTracks);
  },

  // * Getter functions

  async getById(trackID: string) {
    const { docs } = await Tracks.find({
      selector: { _id: trackID },
    });

    return docs[0];
  },

  async getByPath(trackPath: string) {
    if (!trackPath) return;
    const { docs } = await Tracks.find({
      selector: { path: trackPath },
    });

    return docs[0];
  },

  // * Features

  /**
   * Increments `playCount` attribute for the given track
   */
  async incrementPlayCount(trackID: string) {
    const doc = await Tracks.get(trackID);
    await Tracks.put({
      ...doc,
      playCount: doc.playCount + 1,
    });
  },

  /**
   * Changes `favorite` for the given track
   */
  async updateFavorite(trackID: string) {
    const doc = await Tracks.get(trackID);
    await Tracks.put({
      ...doc,
      favorite: !doc.favorite,
    });
  },

  /**
   * Update `lastPlayed` to current time for the given track
   */
  async updateLastPlayed(trackID: string) {
    const doc = await Tracks.get(trackID);
    await Tracks.put({
      ...doc,
      lastPlayed: new Date(),
    });
  },

  // * Helpers

  async clear() {
    const allTracks = await TracksDB.getAll();
    const deletedTracks = allTracks.map((track) => {
      return {
        ...(track as TrackModel),
        _deleted: true,
      };
    });
    if (!deletedTracks) return;

    Tracks.bulkDocs(deletedTracks);
  },
};

export { TracksDB };
