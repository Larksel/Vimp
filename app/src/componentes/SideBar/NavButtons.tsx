import { useNavigate } from 'react-router-dom';

import {
  House,
  MagnifyingGlass,
  MusicNote,
  MonitorPlay,
} from '@phosphor-icons/react';
import { Button } from '../ui/button';

import { ROUTES } from '../../Rotas';

const navButtons = [
  {
    text: 'Home',
    icon: <House size={28} className='shrink-0' />,
    page: ROUTES.HOME,
  },
  {
    text: 'Search',
    icon: <MagnifyingGlass size={28} className='shrink-0' />,
    page: ROUTES.SEARCH,
  },
  {
    text: 'Music Library',
    icon: <MusicNote size={28} className='shrink-0' />,
    page: ROUTES.MUSIC_LIBRARY,
  },
  {
    text: 'Video Library',
    icon: <MonitorPlay size={28} className='shrink-0' />,
    page: ROUTES.VIDEO_LIBRARY,
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
          variant='ghost'
          onClick={() => navigate(page)}
          className='text-md h-14 w-full justify-start gap-3 rounded-none px-[18px] hover:bg-accent active:bg-[#fff3]'
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
