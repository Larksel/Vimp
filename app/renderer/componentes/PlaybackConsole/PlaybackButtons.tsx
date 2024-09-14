import {
  Shuffle,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Repeat,
  RepeatOnce,
} from '@phosphor-icons/react';

import usePlayerStore, { usePlayerAPI } from '@/stores/usePlayerStore';
import { PlayerStatus } from '../../../shared/types/vimp';

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
    all: <Repeat size={20} className='text-green-500' />,
    one: <RepeatOnce size={20} className='text-green-500' />,
  };

  return (
    <div className='flex w-full items-center justify-center gap-4'>
      <button
        className='flex size-8 items-center justify-center text-neutral-400 transition-colors hover:text-neutral-100'
        onClick={() => playerAPI.toggleShuffle()}
      >
        <Shuffle size={20} className={`${shuffle ? 'text-green-500' : ''}`} />
      </button>

      <button
        className='flex size-8 items-center justify-center text-neutral-400 transition-colors hover:text-neutral-100'
        onClick={() => playerAPI.previous()}
      >
        <SkipBack size={20} />
      </button>

      <button
        onClick={() => playerAPI.playPause()}
        className='flex size-8 items-center justify-center rounded-full bg-white text-black'
      >
        {isPlaying() ? (
          <Pause weight='fill' size={16} />
        ) : (
          <Play weight='fill' size={16} />
        )}
      </button>

      <button
        className='flex size-8 items-center justify-center text-neutral-400 transition-colors hover:text-neutral-100'
        onClick={() => playerAPI.next()}
      >
        <SkipForward size={20} />
      </button>

      <button
        className='flex size-8 items-center justify-center text-neutral-400 transition-colors hover:text-neutral-100'
        onClick={() => playerAPI.toggleRepeat()}
      >
        {repeatIcons[repeat]}
      </button>
    </div>
  );
}
