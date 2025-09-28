import MusicInfo from './MusicInfo';
import PlaybackButtons from './PlaybackButtons';
import PlaybackTrack from './PlaybackTrack';
import MoreOptions from './MoreOptions';
import usePlayerEvents from '../../hooks/usePlayerEvents';

export default function PlaybackConsole() {
  usePlayerEvents();

  return (
    <div className='bg-background z-10 flex h-(--playconsole-height) w-full shrink-0 items-center justify-between overflow-hidden px-2'>
      <MusicInfo />

      <div className='flex w-[40%] flex-col items-center gap-2'>
        <PlaybackButtons />
        <PlaybackTrack />
      </div>

      <MoreOptions />
    </div>
  );
}
