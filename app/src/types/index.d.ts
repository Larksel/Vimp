import type { VimpAPI } from '../../preload/preload'

declare module '*.jpg';
declare module '*.png';
declare module '*.module.css';

declare global {
  interface Window {
    VimpAPI: VimpAPI;
  }
}