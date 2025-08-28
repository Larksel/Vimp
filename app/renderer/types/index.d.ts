import type { VimpAPI } from "@preload/preload";

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
