import { useLocation, useNavigate } from 'react-router-dom';

import { HouseIcon } from '@phosphor-icons/react/dist/csr/House';
import { MagnifyingGlassIcon } from '@phosphor-icons/react/dist/csr/MagnifyingGlass';
import { MusicNoteIcon } from '@phosphor-icons/react/dist/csr/MusicNote';
import { MonitorPlayIcon } from '@phosphor-icons/react/dist/csr/MonitorPlay';
import { DownloadSimpleIcon } from '@phosphor-icons/react/dist/csr/DownloadSimple';
import { Button } from '@renderer/components/common';

import { routes } from '@renderer/routes/routes';
import { JSX } from 'react';

interface NavButtonsType {
  text: string;
  icon: JSX.Element;
  page: string;
}

const navButtons: NavButtonsType[] = [
  {
    text: 'Home',
    icon: <HouseIcon size={28} className='shrink-0' />,
    page: routes.HOME.path,
  },
  {
    text: 'Search',
    icon: <MagnifyingGlassIcon size={28} className='shrink-0' />,
    page: routes.SEARCH.path,
  },
  {
    text: 'Music Library',
    icon: <MusicNoteIcon size={28} className='shrink-0' />,
    page: routes.MUSIC_LIBRARY.path,
  },
  {
    text: 'Video Library',
    icon: <MonitorPlayIcon size={28} className='shrink-0' />,
    page: routes.VIDEO_LIBRARY.path,
  },
  {
    text: 'Downloader',
    icon: <DownloadSimpleIcon size={28} className='shrink-0' />,
    page: routes.DOWNLOADER.path,
  },
];

interface NavButtonsProps {
  collapsed: boolean;
}

export default function NavButtons(props: NavButtonsProps) {
  const { collapsed } = props;
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      {navButtons.map(({ text, icon, page }, index) => (
        <Button
          key={text}
          variant={'surface'}
          onClick={() => {
            if (location.pathname.replace('/', '') !== page) navigate(page);
          }}
          className='text-md h-14 w-full justify-start gap-3 px-[18px]'
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
