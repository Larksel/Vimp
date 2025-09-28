import { useCurrentTrack } from '@renderer/features/player';
import { CSSProperties } from 'react';

export default function useLayoutSizes(collapsed?: boolean) {
  const track = useCurrentTrack();

  const appBarHeight = 36;
  const playConsoleHeight = track ? 80 : 0;
  const sidebarSmall = 64;
  const sidebarLarge = 256;

  const cssVars = {
    '--appbar-height': `${appBarHeight}px`,
    '--playconsole-height': `${playConsoleHeight}px`,
    '--sidebar-width': `${collapsed ? sidebarSmall : sidebarLarge}px`,
    '--content-height': `calc(100vh - ${appBarHeight}px - ${playConsoleHeight}px)`,
    '--content-width': `calc(100vw - 24px - var(--sidebar-width))`,
  } as CSSProperties;

  return { cssVars };
}
