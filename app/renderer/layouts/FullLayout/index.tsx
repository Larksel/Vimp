import { Outlet } from 'react-router-dom';
import AppBar from '../components/AppBar';
import useLayoutSizes from '@renderer/hooks/useLayoutSizes';
import { ScrollArea, ScrollBar } from '@renderer/components/common';
import { PlaybackConsole } from '@renderer/features/player/ui';

export default function FullLayout() {
  const { cssVars } = useLayoutSizes({
    absoluteAppBar: true,
    autoHideConsole: false,
  });

  return (
    <div
      style={cssVars}
      className='bg-background flex h-screen w-screen flex-col overflow-hidden transition-all'
    >
      <div className='absolute top-0 right-0 left-0'>
        <AppBar />
      </div>

      <div className='h-(--content-height) shrink-0 overflow-clip pb-2 transition-all'>
        <div className='bg-surface-base relative h-full overflow-clip rounded-b-lg'>
          <ScrollArea className='relative h-full w-full'>
            <div className='h-full w-full transition-all *:h-full'>
              <Outlet />
            </div>
            <ScrollBar orientation='vertical' />
          </ScrollArea>
        </div>
      </div>

      <PlaybackConsole />
    </div>
  );
}
