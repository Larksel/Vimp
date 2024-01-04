import type { VimpAPI } from '../../preload/preload'

declare global {
  declare module '*.jpg';
  declare module '*.png';
  declare module '*.module.css';

  interface Window {
    VimpAPI: VimpAPI;
  }
}