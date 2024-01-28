import path from 'path';
import { app } from 'electron';
import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import { formatDate } from './lib/utils';
import { Track, TrackModel } from '../shared/types/vimp';

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

  //TODO tiro no pé - como descobrir a musica pelo id gerado?
  async insertMany(tracks: Track[]) {
    const tracksWithIds = tracks.map((track, index, array) => {
      const sameTitleTracks = array.filter(
        (t, i) => i !== index && t.title === track.title
      );

      if (sameTitleTracks.length > 0) {
        const filename = path.parse(track.path).base;
        return {
          ...track,
          _id: filename,
        };
      }

      return {
        ...track,
        _id: track.title,
      };
    });

    return Tracks.bulkDocs(tracksWithIds);
  },

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

    return Tracks.put({ ...doc, ...track });
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
  //TODO implementar sistema de treshold para incrementar automaticamente
  async incrementPlayCount(track: TrackModel) {
    const doc = await Tracks.get(track._id);
    await Tracks.put({
      ...doc,
      playCount: doc.playCount + 1,
    });
  },

  /**
   * Changes `favorite` for the given track
   */
  async updateFavorite(track: TrackModel) {
    const doc = await Tracks.get(track._id);
    await Tracks.put({
      ...doc,
      favorite: !doc.favorite,
    });
  },

  /**
   * Update `lastPlayed` to current time for the given track
   */
  async updateLastPlayed(track: TrackModel) {
    const doc = await Tracks.get(track._id);
    await Tracks.put({
      ...doc,
      lastPlayed: new Date(formatDate(new Date())),
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
