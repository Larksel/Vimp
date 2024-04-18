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
    off: <Repeat size={24} />,
    all: <Repeat size={24} className='text-green-500' />,
    one: <RepeatOnce size={24} className='text-green-500' />,
  };

  return (
    <div className='flex w-full items-center gap-4'>
      <div className='flex flex-1 justify-end gap-4'>
        <button
          className='text-zinc-400 transition-colors hover:text-zinc-100'
          onClick={() => dispatch(setShuffle(!shuffle))}
        >
          <Shuffle size={24} className={`${shuffle ? 'text-green-500' : ''}`} />
        </button>

        <button
          className='text-zinc-400 transition-colors hover:text-zinc-100'
          onClick={() => player.previous()}
        >
          <SkipBack size={24} />
        </button>
      </div>

      <button
        onClick={handlePlayPause}
        className='flex h-9 w-9 items-center justify-center rounded-full bg-white text-black'
      >
        {isPlaying ? <Pause weight='fill' size={20} /> : <Play weight='fill' size={20} />}
      </button>

      <div className='flex flex-1 gap-4'>
        <button
          className='text-zinc-400 transition-colors hover:text-zinc-100'
          onClick={() => player.next()}
        >
          <SkipForward size={24} />
        </button>

        <button
          className='text-zinc-400 transition-colors hover:text-zinc-100'
          onClick={() => dispatch(changeRepeat())}
        >
          {repeatIcons[repeat]}
        </button>
      </div>
    </div>
  );
}
