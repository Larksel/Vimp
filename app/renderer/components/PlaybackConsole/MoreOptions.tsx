import { PlaylistIcon } from '@phosphor-icons/react/dist/csr/Playlist';
import { InfoIcon } from '@phosphor-icons/react/dist/csr/Info';

import VolumeControl from './VolumeControl';
import { useNavigate, useLocation } from 'react-router-dom';
import { routes } from '@renderer/routes/routes';
import { Button } from '@renderer/components/common/button';

export default function MoreOptions() {
  const navigate = useNavigate();
  const location = useLocation();

  const buttons = [
    {
      id: 'queue',
      icon: <PlaylistIcon size={24} />,
      action: () => {
        if (location.pathname.replace('/', '') !== routes.QUEUE.path)
          navigate(routes.QUEUE.path);
      },
    },
    {
      id: 'moreinfo',
      icon: <InfoIcon size={24} />,
      action: () => console.log('Show extended music info'),
    },
  ];

  return (
    <div className='flex h-full w-[30%] flex-row items-center justify-end gap-2 px-2'>
      {buttons.map((button) => (
        <Button
          key={button.id}
          onClick={button.action}
          variant={'glass'}
          className='aspect-square size-6 rounded-full p-0'
        >
          {button.icon}
        </Button>
      ))}
      <VolumeControl />
    </div>
  );
}
