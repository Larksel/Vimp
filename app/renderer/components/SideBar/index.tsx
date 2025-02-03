import { CaretLeft, CaretRight } from '@phosphor-icons/react';

import logo from '@assets/images/logo.png';

import NavButtons from './NavButtons';
import PlaylistList from './PlaylistList';
import { Button } from '@components/common/button';

interface SideBarProps {
  toggle: () => void;
  collapsed: boolean;
}

export default function SideBar({ toggle, collapsed }: SideBarProps) {
  return (
    <div className='flex w-(--sidebar-width) flex-col items-center gap-2 overflow-clip rounded-lg transition-all select-none'>
      <div className='bg-background-surface-base flex h-auto w-full shrink-0 flex-col items-center justify-center overflow-clip rounded-lg'>
        <Button
          onClick={toggle}
          variant={'surface'}
          className='text-md relative flex h-14 w-full items-center justify-center px-2 transition-all'
        >
          <img src={logo} className='max-h-8 select-none' alt='vimp logo' />
          <div className='absolute right-0 left-0 flex items-center justify-between'>
            <CaretRight
              weight='bold'
              className={`absolute ${collapsed ? 'left-[-100%] opacity-0' : 'left-4 w-5 opacity-100'} h-5 transition-all`}
            />
            <CaretLeft
              weight='bold'
              className={`absolute ${collapsed ? 'right-[-100%] opacity-0' : 'right-4 w-5 opacity-100'} h-5 transition-all`}
            />
          </div>
        </Button>

        <NavButtons collapsed={collapsed} />
      </div>

      <div className='bg-background-surface-base h-full w-full overflow-hidden rounded-lg'>
        <PlaylistList collapsed={collapsed} />
      </div>
    </div>
  );
}
