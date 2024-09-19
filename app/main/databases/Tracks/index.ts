import path from 'path';
import { app } from 'electron';
import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import { Track, TrackModel } from '@shared/types/vimp';

PouchDB.plugin(PouchDBFind);

const userDataPath = app.getPath('userData');

const TracksDB = new PouchDB<Track>(path.join(userDataPath, 'TracksDB'), {
  adapter: 'leveldb',
  auto_compaction: true,
});