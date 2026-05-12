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

  /* DATABASES */
  GENERICDB_HAS_CHANGED = 'genericDB:hasChanged',

  // TracksDB
  TRACKSDB_GET_ALL = 'tracksDB:getAll',
  TRACKSDB_GET_BY_ID = 'tracksDB:getById',
  TRACKSDB_CREATE = 'tracksDB:create',
  TRACKSDB_UPDATE = 'tracksDB:update',
  TRACKSDB_DELETE = 'tracksDB:delete',
  TRACKSDB_CLEAR = 'tracksDB:clear',
  TRACKSDB_HAS_CHANGED = 'tracksDB:hasChanged',

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
  PLAYLISTSDB_HAS_CHANGED = 'playlistsDB:hasChanged',

  PLAYLISTSDB_INCREMENT_PLAY_COUNT = 'playlistsDB:incrementPlayCount',
  PLAYLISTSDB_UPDATE_FAVORITE = 'playlistsDB:updateFavorite',
  PLAYLISTSDB_UPDATE_LAST_PLAYED = 'playlistsDB:updateLastPlayed',

  // Media
  MEDIA_GET_ALL = 'media:getAll',
  MEDIA_GET_BY_ID = 'media:getById',
  MEDIA_GET_BY_PATH = 'media:getByPath',
  MEDIA_CREATE = 'media:create',
  MEDIA_UPDATE = 'media:update',
  MEDIA_DELETE_BY_ID = 'media:deleteById',
  MEDIA_IMPORT_TRACK = 'media:importTrack',
  MEDIA_IMPORT_TRACKS = 'media:importTracks',
  MEDIA_SCAN_MISSING = 'media:scanMissing',
  MEDIA_RECORD_AUDIO_PLAYBACK = 'media:recordAudioPlayback',
  MEDIA_DELETE_BY_PATH = 'media:deleteByPath',
  MEDIA_HAS_CHANGED = 'media:hasChanged',

  // Playlist
  PLAYLIST_GET_ALL = 'playlist:getAll',
  PLAYLIST_GET_BY_ID = 'playlist:getById',
  PLAYLIST_GET_BY_SLUG = 'playlist:getBySlug',
  PLAYLIST_CREATE = 'playlist:create',
  PLAYLIST_UPDATE = 'playlist:update',
  PLAYLIST_DELETE_BY_ID = 'playlist:deleteById',
  PLAYLIST_ADD_MEDIA = 'playlist:addMedia',
  PLAYLIST_REMOVE_MEDIA = 'playlist:removeMedia',
  PLAYLIST_MOVE_ITEM = 'playlist:moveItem',
  PLAYLIST_CLEANUP_MISSING = 'playlist:cleanupMissing',
  PLAYLIST_HAS_CHANGED = 'playlist:hasChanged',
}

export default IPCChannels;
