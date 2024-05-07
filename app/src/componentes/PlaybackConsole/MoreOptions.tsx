import { Playlist, Info } from '@phosphor-icons/react';

import VolumeControl from './VolumeControl';

export default function MoreOptions() {
  const buttons = [
    {
      icon: <Playlist size={24} />,
      action: () => console.log('Open queue'),
    },
    {
      icon: <Info size={24} />,
      action: () => console.log('Show extended music info'),
    },
  ];

  return (
    <div className='flex h-full w-[30%] flex-row items-center justify-end gap-2 px-2'>
      {buttons.map((button, index) => (
        <button
          key={index}
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
