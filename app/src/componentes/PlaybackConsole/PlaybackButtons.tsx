import { useSelector, useDispatch } from 'react-redux';

import {
  Shuffle,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Repeat,
  RepeatOnce,
} from '@phosphor-icons/react';

import {
  setShuffle,
  changeRepeat,
  selectShuffle,
  selectIsPlaying,
  selectRepeat,
} from '../../features/playerSlice';

import player from '../../lib/player';

export default function PlaybackButtons() {
  const shuffle = useSelector(selectShuffle);
  const isPlaying = useSelector(selectIsPlaying);
  const repeat = useSelector(selectRepeat);
  const dispatch = useDispatch();

  const handlePlayPause = () => {
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  };

  const repeatIcons = {
    off: <Repeat size={20} />,
    all: <Repeat size={20} className='text-green-500' />,
    one: <RepeatOnce size={20} className='text-green-500' />,
  };

  return (
    <div className='flex w-full items-center gap-4'>
      <div className='flex flex-1 justify-end gap-2'>
        <button
          className='relative flex size-8 items-center justify-center text-neutral-400 transition-colors hover:text-neutral-100'
          onClick={() => dispatch(setShuffle(!shuffle))}
        >
          <Shuffle size={20} className={`${shuffle ? 'text-green-500' : ''}`} />
        </button>

        <button
          className='relative flex size-8 items-center justify-center text-neutral-400 transition-colors hover:text-neutral-100'
          onClick={() => player.previous()}
        >
          <SkipBack size={20} />
        </button>
      </div>

      <button
        onClick={handlePlayPause}
        className='flex size-8 items-center justify-center rounded-full bg-white text-black'
      >
        {isPlaying ? (
          <Pause weight='fill' size={16} />
        ) : (
          <Play weight='fill' size={16} />
        )}
      </button>

      <div className='flex flex-1 gap-2'>
        <button
          className='relative flex size-8 items-center justify-center text-neutral-400 transition-colors hover:text-neutral-100'
          onClick={() => player.next()}
        >
          <SkipForward size={20} />
        </button>

        <button
          className='relative flex size-8 items-center justify-center text-neutral-400 transition-colors hover:text-neutral-100'
          onClick={() => dispatch(changeRepeat())}
        >
          {repeatIcons[repeat]}
        </button>
      </div>
    </div>
  );
}
