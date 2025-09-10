import type { VimpAPI } from "@preload/preload";
import { FC, ReactNode } from "react";

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

export interface RouteDefinitionItem {
  displayName?: string;
  path: string;
  element: ReactNode | FC;
}

export type RoutesDefinition = Record<string, RouteDefinitionItem>