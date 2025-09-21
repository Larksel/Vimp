import { ShuffleIcon } from '@phosphor-icons/react/dist/csr/Shuffle';
import { SkipBackIcon } from '@phosphor-icons/react/dist/csr/SkipBack';
import { PlayIcon } from '@phosphor-icons/react/dist/csr/Play';
import { PauseIcon } from '@phosphor-icons/react/dist/csr/Pause';
import { SkipForwardIcon } from '@phosphor-icons/react/dist/csr/SkipForward';
import { RepeatIcon } from '@phosphor-icons/react/dist/csr/Repeat';
import { RepeatOnceIcon } from '@phosphor-icons/react/dist/csr/RepeatOnce';

import usePlayerStore, { usePlayerAPI } from '@renderer/stores/usePlayerStore';
import { PlayerStatus } from '@shared/types/vimp';
import { Button } from '@renderer/components/common/button';
import { useRef } from 'react';
import { useAudioAnimation } from '@renderer/hooks/useAudioAnimation';

export default function PlaybackButtons() {
  const playerAPI = usePlayerAPI();
  const playerStatus = usePlayerStore((state) => state.playerStatus);
  const isShuffleEnabled = usePlayerStore((state) => state.isShuffleEnabled);
  const repeatMode = usePlayerStore((state) => state.repeatMode);

  const shuffleButtonRef = useRef<HTMLButtonElement>(null);
  const previousButtonRef = useRef<HTMLButtonElement>(null);
  const playButtonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const repeatButtonRef = useRef<HTMLButtonElement>(null);

  useAudioAnimation(
    [shuffleButtonRef, previousButtonRef, nextButtonRef, repeatButtonRef],
    (audioData) => {
      const brightness = 1 + audioData.bass * 1;
      return { filter: `brightness(${brightness})` };
    },
  );

  useAudioAnimation([playButtonRef], (audioData) => {
    const scale = 1 + audioData.bass * 0.2;
    return { transform: `scale(${scale})` };
  });

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
    off: <RepeatIcon size={20} />,
    all: <RepeatIcon size={20} className='text-accent' />,
    one: <RepeatOnceIcon size={20} className='text-accent' />,
  };

  return (
    <div className='flex w-full items-center justify-center gap-4'>
      <Button
        ref={shuffleButtonRef}
        variant={'glass'}
        className='flex size-8 items-center justify-center rounded-full p-0'
        onClick={() => playerAPI.toggleShuffle()}
      >
        <ShuffleIcon
          size={20}
          className={`${isShuffleEnabled ? 'text-accent' : ''}`}
        />
      </Button>

      <Button
        ref={previousButtonRef}
        variant={'glass'}
        className='flex size-8 items-center justify-center rounded-full p-0'
        onClick={() => playerAPI.playPreviousTrack()}
      >
        <SkipBackIcon size={20} />
      </Button>

      <Button
        ref={playButtonRef}
        variant={'filled'}
        onClick={() => playerAPI.togglePlayPause()}
        className='flex size-8 items-center justify-center rounded-full p-0'
      >
        {isPlaying() ? (
          <PauseIcon weight='fill' size={16} />
        ) : (
          <PlayIcon weight='fill' size={16} />
        )}
      </Button>

      <Button
        ref={nextButtonRef}
        variant={'glass'}
        className='flex size-8 items-center justify-center rounded-full p-0'
        onClick={() => playerAPI.playNextTrack()}
      >
        <SkipForwardIcon size={20} />
      </Button>

      <Button
        ref={repeatButtonRef}
        variant={'glass'}
        className='flex size-8 items-center justify-center rounded-full p-0'
        onClick={() => playerAPI.toggleRepeatMode()}
      >
        {repeatIcons[repeatMode]}
      </Button>
    </div>
  );
}
