export enum RepeatMode {
  OFF = 'off',
  ALL = 'all',
  ONE = 'one',
}

export enum PlayerStatus {
  PLAY = 'play',
  PAUSE = 'pause',
  STOP = 'stop',
}

//TODO 0. Verificar se informações de outros tipos de arquivos (ex. Video) podem ser adicionadas
//TODO 1. Separar as informações de arquivo e as informações de utilidade do tipo Track
//TODO 2. Atualizar o tipo TrackModel com os tipos criados
//TODO 3. Refatorar função de processamento dos metadados
//TODO 4. Adicionar valores padrão para as informações de utilidade
/*
  //* Exemplo de informações apenas do arquivo
  export interface TrackFile {
    title: string;
    album: string | undefined;
    artist: string[];
    genre: string[];
    duration: number | undefined;
    path: string;
    cover: string;

    //* base: music-metadata IAudioMetadata
    bpm?
    size?
    albumartist?
    year?
    fileName?
    format?
    bitrate?
    samplerate?
    channels?
    bitspersample?
  }

  //* exemplo de tipo com informações adicionais
  export interface TrackData extends TrackFile {
    playCount: number;
    favorite: boolean;
  }

  //* possíveis dados comuns
  export interface CommonData {
    dateAdded: Date;
    lastPlayed: string | null;
    dateCreated: Date; // no caso de playlist
    dateModified: Date; // pode ser util como filtro
  }
*/

export interface Track {
  title: string;
  album: string | undefined;
  artist: string[];
  genre: string[];
  duration: number | undefined;
  playCount: number;
  favorite: boolean;
  lastPlayed: string | null;
  path: string;
  cover: string;
}

export type TrackModel = PouchDB.Core.ExistingDocument<
  Track & PouchDB.Core.AllDocsMeta
>;

export interface Config {
  audioVolume: number,
  audioPlaybackRate: number,
  audioMuted: boolean,
  audioShuffle: boolean,
  audioRepeatMode: RepeatMode,
  audioGaplessPlayback: boolean,
  audioCrossfadeDuration: number,
  musicFolders: string[],

  displayNotifications: boolean,
}