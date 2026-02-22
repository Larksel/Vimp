/// <reference types="vite/client" />

import type { VimpAPI } from '@preload/preload';
import { ReactNode } from 'react';

declare global {
  declare module '*.jpg';
  declare module '*.png';
  declare module '*.svg';
  declare module '*.module.css';
  declare module '*.mp3';
  declare module '*.ogg';
  declare module '*.wav';

  interface Window {
    VimpAPI: VimpAPI;
  }
}

export interface RouteDefinition {
  displayName?: string;
  path?: string;
  element: ReactNode;
  index?: boolean;
}

export interface Player {
  play: () => Promise<void>;
  pause: () => void;
  stop: () => void;
  mute: () => void;
  unmute: () => void;
  getAudio: () => HTMLAudioElement;
  getVolume: () => number;
  getCurrentTime: () => number;
  getTrack: () => TrackModel | null;
  getSampleRate: () => number;
  getAnalyzerFftSize: () => number;
  getAnalyzerBufferSize: () => number;
  getAnalyzerTimeDomain: (dataArray: Uint8Array<ArrayBuffer>) => void;
  getAnalyserFrequency: (dataArray: Uint8Array<ArrayBuffer>) => void;
  setVolume: (volume: number) => void;
  setPlaybackRate: (playbackRate: number) => void;
  setCurrentTime: (currentTime: number) => void;
  setTrack: (track: TrackModel) => Promise<void>;
  freeSrcObject: () => void;
}
