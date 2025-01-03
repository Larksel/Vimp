import { Playlist, Info } from '@phosphor-icons/react';

import VolumeControl from './VolumeControl';
import { useNavigate, useLocation } from 'react-router-dom';
import routes from '@renderer/routes';

export default function MoreOptions() {
  const navigate = useNavigate();
  const location = useLocation();

  const buttons = [
    {
      id: 'queue',
      icon: <Playlist size={24} />,
      action: () => {
        if (location.pathname.replace('/', '') !== routes.QUEUE)
          navigate(routes.QUEUE);
      },
    },
    {
      id: 'moreinfo',
      icon: <Info size={24} />,
      action: () => console.log('Show extended music info'),
    },
  ];

  return (
    <div className='flex h-full w-[30%] flex-row items-center justify-end gap-2 px-2'>
      {buttons.map((button) => (
        <button
          key={button.id}
          onClick={button.action}
          className='text-neutral-400 transition-colors hover:text-neutral-100'
        >
          {button.icon}
        </button>
      ))}
      <VolumeControl />
    </div>
  );
}
