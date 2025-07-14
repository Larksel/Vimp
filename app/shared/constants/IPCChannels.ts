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

  //FILE SYSTEM (FS)
  LOAD_AUDIO_FILE = 'fs:loadAudioFile',

  // LIBRARY
  LIBRARY_IMPORT = 'library:import',
  LIBRARY_SCAN = 'library:scan',
  LIBRARY_SCAN_AND_SAVE = 'library:scanAndSave',

  // METADATA
  METADATA_GET_COVER = 'metadata:getCover',

  /* DATABASES */
  DB_HAS_CHANGED = 'db:hasChanged',

  // TracksDB
  TRACKSDB_GET_ALL = 'tracksDB:getAll',
  TRACKSDB_GET_BY_ID = 'tracksDB:getById',
  TRACKSDB_CREATE = 'tracksDB:create',
  TRACKSDB_UPDATE = 'tracksDB:update',
  TRACKSDB_DELETE = 'tracksDB:delete',
  TRACKSDB_CLEAR = 'tracksDB:clear',

  TRACKSDB_GET_BY_PATH = 'tracksDB:getByPath',
  TRACKSDB_INCREMENT_PLAY_COUNT = 'tracksDB:incrementPlayCount',
  TRACKSDB_UPDATE_FAVORITE = 'tracksDB:updateFavorite',
  TRACKSDB_UPDATE_LAST_PLAYED = 'tracksDB:updateLastPlayed',

  // PlaylistsDB
  PLAYLISTSDB_GET_ALL = 'playlistsDB:getAll',
  PLAYLISTSDB_GET_BY_ID = 'playlistsDB:getById',
  PLAYLISTSDB_CREATE = 'playlistsDB:create',
  PLAYLISTSDB_UPDATE = 'playlistsDB:update',
  PLAYLISTSDB_DELETE = 'playlistsDB:delete',
  PLAYLISTSDB_CLEAR = 'playlistsDB:clear',

  PLAYLISTSDB_INCREMENT_PLAY_COUNT = 'playlistsDB:incrementPlayCount',
  PLAYLISTSDB_UPDATE_FAVORITE = 'playlistsDB:updateFavorite',
  PLAYLISTSDB_UPDATE_LAST_PLAYED = 'playlistsDB:updateLastPlayed',
}

export default IPCChannels;
