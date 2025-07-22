import { useLocation, useNavigate } from 'react-router-dom';

import { HouseIcon } from '@phosphor-icons/react/dist/csr/House';
import { MagnifyingGlassIcon } from '@phosphor-icons/react/dist/csr/MagnifyingGlass';
import { MusicNoteIcon } from '@phosphor-icons/react/dist/csr/MusicNote';
import { MonitorPlayIcon } from '@phosphor-icons/react/dist/csr/MonitorPlay';
import { DownloadSimpleIcon } from '@phosphor-icons/react/dist/csr/DownloadSimple';
import { Button } from '@renderer/components/common/button';

import routes from '@renderer/routes/routes';

const navButtons = [
  {
    text: 'Home',
    icon: <HouseIcon size={28} className='shrink-0' />,
    page: routes.HOME,
  },
  {
    text: 'Search',
    icon: <MagnifyingGlassIcon size={28} className='shrink-0' />,
    page: routes.SEARCH,
  },
  {
    text: 'Music Library',
    icon: <MusicNoteIcon size={28} className='shrink-0' />,
    page: routes.MUSIC_LIBRARY,
  },
  {
    text: 'Video Library',
    icon: <MonitorPlayIcon size={28} className='shrink-0' />,
    page: routes.VIDEO_LIBRARY,
  },
  {
    text: 'Downloader',
    icon: <DownloadSimpleIcon size={28} className='shrink-0' />,
    page: routes.DOWNLOADER,
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
