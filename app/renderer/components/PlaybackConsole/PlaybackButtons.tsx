import {
  Shuffle,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Repeat,
  RepeatOnce,
} from '@phosphor-icons/react';

import usePlayerStore, { usePlayerAPI } from '@stores/usePlayerStore';
import { PlayerStatus } from '@shared/types/vimp';
import { Button } from '@components/common/button';

export default function PlaybackButtons() {
  const playerAPI = usePlayerAPI();
  const playerStatus = usePlayerStore((state) => state.playerStatus);
  const shuffle = usePlayerStore((state) => state.shuffle);
  const repeat = usePlayerStore((state) => state.repeat);

  const isPlaying = () => {
    switch (playerStatus) {
      case PlayerStatus.PAUSE:
        return false;
      case PlayerStatus.STOP:
        return false;
      case PlayerStatus.PLAY:
        return true;
      default:
        return;
    }
  };

  const repeatIcons = {
    off: <Repeat size={20} />,
    all: <Repeat size={20} className='text-accent' />,
    one: <RepeatOnce size={20} className='text-accent' />,
  };

  return (
    <div className='flex w-full items-center justify-center gap-4'>
      <Button
        variant={'glass'}
        className='flex size-8 items-center justify-center rounded-full p-0'
        onClick={() => playerAPI.toggleShuffle()}
      >
        <Shuffle
          size={20}
          className={`${shuffle ? 'text-accent' : ''}`}
        />
      </Button>

      <Button
        variant={'glass'}
        className='flex size-8 items-center justify-center rounded-full p-0'
        onClick={() => playerAPI.goToPrevious()}
      >
        <SkipBack size={20} />
      </Button>

      <Button
        variant={'filled'}
        onClick={() => playerAPI.playPause()}
        className='flex size-8 items-center justify-center rounded-full p-0'
      >
        {isPlaying() ? (
          <Pause weight='fill' size={16} />
        ) : (
          <Play weight='fill' size={16} />
        )}
      </Button>

      <Button
        variant={'glass'}
        className='flex size-8 items-center justify-center rounded-full p-0'
        onClick={() => playerAPI.skipToNext()}
      >
        <SkipForward size={20} />
      </Button>

      <Button
        variant={'glass'}
        className='flex size-8 items-center justify-center rounded-full p-0'
        onClick={() => playerAPI.toggleRepeat()}
      >
        {repeatIcons[repeat]}
      </Button>
    </div>
  );
}
