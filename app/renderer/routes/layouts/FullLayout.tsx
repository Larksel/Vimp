import BaseLayout from './BaseLayout';
import { ScrollArea, ScrollBar } from '@renderer/components/common';
import { Outlet } from 'react-router-dom';

export default function FrameLayout() {
  return (
    <BaseLayout isAppBarAbsolute={true} autoHideConsole={false}>
      <main className='relative size-full min-h-0 min-w-0 overflow-hidden rounded-b-lg'>
        <ScrollArea className='relative h-full w-full'>
          <Outlet />
          <ScrollBar orientation='vertical' />
        </ScrollArea>
      </main>
    </BaseLayout>
  );
}
