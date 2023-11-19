declare module "*.jpg";
declare module "*.png";
declare module "*.module.css";

interface Window {
  electronAPI: {
    minimize: () => void;
    maximizeOrRestore: () => void;
    close: () => void;
  }
}