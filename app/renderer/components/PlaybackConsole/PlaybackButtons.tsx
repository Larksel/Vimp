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
  const isShuffleEnabled = usePlayerStore((state) => state.isShuffleEnabled);
  const repeatMode = usePlayerStore((state) => state.repeatMode);

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
          className={`${isShuffleEnabled ? 'text-accent' : ''}`}
        />
      </Button>

      <Button
        variant={'glass'}
        className='flex size-8 items-center justify-center rounded-full p-0'
        onClick={() => playerAPI.playPreviousTrack()}
      >
        <SkipBack size={20} />
      </Button>

      <Button
        variant={'filled'}
        onClick={() => playerAPI.togglePlayPause()}
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
        onClick={() => playerAPI.playNextTrack()}
      >
        <SkipForward size={20} />
      </Button>

      <Button
        variant={'glass'}
        className='flex size-8 items-center justify-center rounded-full p-0'
        onClick={() => playerAPI.toggleRepeatMode()}
      >
        {repeatIcons[repeatMode]}
      </Button>
    </div>
  );
}
