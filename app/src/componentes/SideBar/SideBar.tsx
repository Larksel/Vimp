import { CaretLeft, CaretRight } from '@phosphor-icons/react';

import logo from '../../assets/images/logo.png';

import NavButtons from './NavButtons';
import PlaylistList from './PlaylistList';

export default function SideBar({ className, toggle, collapsed }) {
  return (
    <div className={className}>
      <div className='flex w-full flex-col items-center justify-center'>
        <button
          onClick={toggle}
          className='relative flex h-14 w-full items-center justify-center px-2 transition-all hover:bg-accent focus-visible:outline-none active:bg-[#fff3]'
        >
          <img src={logo} className='max-h-8 select-none' />
          <div className='absolute left-0 right-0 flex items-center justify-between'>
            <CaretRight
              weight='bold'
              className={`absolute ${collapsed ? 'left-[-100%] opacity-0' : 'left-4 w-5 opacity-100'}  h-5 transition-all`}
            />
            <CaretLeft
              weight='bold'
              className={`absolute ${collapsed ? 'right-[-100%] opacity-0' : 'right-4 w-5 opacity-100'}  h-5 transition-all`}
            />
          </div>
        </button>

        <NavButtons collapsed={collapsed} />
      </div>

      {/* PlaylistList */}
    </div>
  );
}
