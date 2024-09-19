// TODO Arrumar tipo generico
// import path from 'path';
// import { app } from 'electron';
// import PouchDB from 'pouchdb';
// import PouchDBFind from 'pouchdb-find';
// import { Track, TrackModel } from '@shared/types/vimp';
// PouchDB.plugin(PouchDBFind);
// const userDataPath = app.getPath('userData');
// export function createDatabase<T>(dbName: string): PouchDB.Database<T> {
//   return new PouchDB<T>(path.join(userDataPath, dbName), {
//     adapter: 'leveldb',
//     auto_compaction: true,
//   });
// }