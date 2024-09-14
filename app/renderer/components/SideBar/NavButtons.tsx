import { useNavigate } from 'react-router-dom';

import {
  House,
  MagnifyingGlass,
  MusicNote,
  MonitorPlay,
} from '@phosphor-icons/react';
import { Button } from '../common/button';

import routes from '@/routes';

// TODO Downloader

const navButtons = [
  {
    text: 'Home',
    icon: <House size={28} className='shrink-0' />,
    page: routes.HOME,
  },
  {
    text: 'Search',
    icon: <MagnifyingGlass size={28} className='shrink-0' />,
    page: routes.SEARCH,
  },
  {
    text: 'Music Library',
    icon: <MusicNote size={28} className='shrink-0' />,
    page: routes.MUSIC_LIBRARY,
  },
  {
    text: 'Video Library',
    icon: <MonitorPlay size={28} className='shrink-0' />,
    page: routes.VIDEO_LIBRARY,
  },
];

interface NavButtonsProps {
  collapsed: boolean;
}

export default function NavButtons({ collapsed }: NavButtonsProps) {
  const navigate = useNavigate();

  return (
    <>
      {navButtons.map(({ text, icon, page }, index) => (
        <Button
          key={text}
          variant='default'
          onClick={() => navigate(page)}
          className='text-md h-14 w-full justify-start gap-3 rounded-none bg-transparent px-[18px]'
        >
          {icon}
          <p
            className={`transition-all ${collapsed ? '-translate-x-3 opacity-0' : ''}`}
            style={{
              transitionDelay: !collapsed ? `${(index + 1) * 75}ms` : '',
            }}
          >
            {text}
          </p>
        </Button>
      ))}
    </>
  );
}
