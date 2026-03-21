import useLayoutSizes from '@renderer/hooks/useLayoutSizes';
import AppBar from './components/AppBar';
import { PlaybackConsole } from '@renderer/features/player';
import { ReactNode } from 'react';

interface BaseLayoutProps {
  children: ReactNode;
  isAppBarAbsolute: boolean;
  autoHideConsole: boolean;
}

export default function BaseLayout({
  isAppBarAbsolute,
  autoHideConsole,
  children,
}: BaseLayoutProps) {
  const { cssVars } = useLayoutSizes({
    autoHideConsole,
  });

  return (
    <div
      style={cssVars}
      className='bg-background flex h-screen w-screen flex-col overflow-hidden transition-all'
    >
      <AppBar absolutePos={isAppBarAbsolute} />
      <div className='min-h-0 flex-1 transition-all'>{children}</div>
      <PlaybackConsole />
    </div>
  );
}
