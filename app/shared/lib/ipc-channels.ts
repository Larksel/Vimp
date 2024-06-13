const channels = {
  // DIALOG
  PICK_FILES: 'PICK_FILES',
  OPEN_FILE: 'OPEN_FILE',

  // DATABASE
  INSERT_TRACKS: 'INSERT_TRACKS',
  GET_TRACKS: 'GET_TRACKS',
  UPDATE_TRACK: 'UPDATE_TRACK',
  DELETE_TRACK: 'DELETE_TRACK',

  GET_TRACK_BY_ID: 'GET_TRACK_ID',
  GET_TRACK_BY_PATH: 'GET_TRACK_PATH',

  INCREMENT_PLAY_COUNT: 'INCREMENT_PLAY_COUNT',
  TOGGLE_FAVORITE: 'TOGGLE_FAVORITE',
  UPDATE_LAST_PLAYED: 'UPDATE_LAST_PLAYED',
  TRACKS_DB_CHANGED: 'TRACKS_DB_CHANGED',

  CLEAR_TRACKS: 'CLEAR_TRACKS',

  // TRACKS
  GET_COVER: 'GET_COVER',

  // LIBRARY
  LIBRARY_IMPORT_TRACKS: 'LIBRARY_IMPORT_TRACKS',
  LIBRARY_SCAN_TRACKS: 'LIBRARY_SCAN_TRACKS',

  // CONFIG
  CONFIG_GET: 'CONFIG_GET',
  CONFIG_GET_ALL: 'CONFIG_GET_ALL',
  CONFIG_SET: 'CONFIG_SET',
};

export default channels;
