import PlayerEvents from '@renderer/components/Events/PlayerEvents';
import MusicInfo from './MusicInfo';
import PlaybackButtons from './PlaybackButtons';
import PlaybackTrack from './PlaybackTrack';
import MoreOptions from './MoreOptions';

export default function PlaybackConsole() {
  return (
    <div className='bg-background z-10 flex h-(--playconsole-height) w-full shrink-0 items-center justify-between overflow-hidden px-2'>
      <PlayerEvents />
      <MusicInfo />

      <div className='flex w-[40%] flex-col items-center gap-2'>
        <PlaybackButtons />
        <PlaybackTrack />
      </div>

      <MoreOptions />
    </div>
  );
}
