import { useCurrentTrack } from '@renderer/features/player';
import { CSSProperties } from 'react';

interface LayoutSetupOpts {
  collapsed?: boolean;
  absoluteAppBar?: boolean;
  autoHideConsole?: boolean;
}

export default function useLayoutSizes(opts: LayoutSetupOpts = {}) {
  const track = useCurrentTrack();
  const {
    collapsed = false,
    absoluteAppBar = false,
    autoHideConsole = false,
  } = opts;

  const appBarHeight = 36;
  const playConsoleHeight = autoHideConsole && !track ? 0 : 80;
  const sidebarSmall = 64;
  const sidebarLarge = 256;

  const cssVars = {
    '--appbar-height': `${appBarHeight}px`,
    '--playconsole-height': `${playConsoleHeight}px`,
    '--sidebar-width': `${collapsed ? sidebarSmall : sidebarLarge}px`,
    '--content-height': `calc(100vh - ${absoluteAppBar ? '0' : appBarHeight}px - ${playConsoleHeight}px)`,
    '--content-width': `calc(100vw - 24px - var(--sidebar-width))`,
  } as CSSProperties;

  return { cssVars };
}
