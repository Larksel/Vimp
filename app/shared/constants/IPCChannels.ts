/**
 * Contains the IPC channels used in the application
 */
enum IPCChannels {
  // CONFIG
  CONFIG_GET = 'config:get',
  CONFIG_GET_ALL = 'config:getAll',
  CONFIG_SET = 'config:set',

  // DIALOG
  DIALOG_PICK_FILES = 'dialog:pickFiles',
  DIALOG_OPEN_FILE = 'dialog:openFile',

  // LIBRARY
  LIBRARY_IMPORT_TRACKS = 'library:importTracks',
  LIBRARY_SCAN_TRACKS = 'library:scanTracks',

  // METADATA
  METADATA_GET_COVER = 'metadata:getCover',

  /* DATABASES */
  DB_HAS_CHANGED = 'db:hasChanged',

  // TracksDB
  TRACKSDB_INSERT_MANY = 'tracksDB:insertMany',
  TRACKSDB_UPDATE_MANY = 'tracksDB:updateMany',
  TRACKSDB_DELETE_MANY = 'tracksDB:deleteMany',

  TRACKSDB_GET_ALL = 'tracksDB:getAll',
  TRACKSDB_GET_BY_ID = 'tracksDB:getById',
  TRACKSDB_UPDATE = 'tracksDB:update',
  TRACKSDB_DELETE = 'tracksDB:delete',
  TRACKSDB_CLEAR = 'tracksDB:clear',

  TRACKSDB_GET_BY_PATH = 'tracksDB:getByPath',
  TRACKSDB_INCREMENT_PLAY_COUNT = 'tracksDB:incrementPlayCount',
  TRACKSDB_UPDATE_FAVORITE = 'tracksDB:updateFavorite',
  TRACKSDB_UPDATE_LAST_PLAYED = 'tracksDB:updateLastPlayed',
  TRACKSDB_HAS_CHANGED = 'tracksDB:hasChanged',
}

export default IPCChannels;
