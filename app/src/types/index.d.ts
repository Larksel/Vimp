declare module '*.jpg';
declare module '*.png';
declare module '*.module.css';

interface Window {
  app: {
    minimize: () => void;
    maximizeOrRestore: () => void;
    close: () => void;
  };
}
