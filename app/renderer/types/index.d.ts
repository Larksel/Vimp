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
