import PlayerEvents from '@components/Events/PlayerEvents';
import MusicInfo from './MusicInfo';
import PlaybackButtons from './PlaybackButtons';
import PlaybackTrack from './PlaybackTrack';
import MoreOptions from './MoreOptions';
import useMediaSession from '@hooks/useMediaSession';

export default function PlaybackConsole() {
  useMediaSession();

  return (
    <div className='z-10 col-span-4 row-span-1 flex h-full w-full items-center justify-between overflow-hidden bg-black px-2'>
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
