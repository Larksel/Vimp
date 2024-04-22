import MusicInfo from './MusicInfo/MusicInfo';
import PlaybackButtons from './PlaybackButtons';
import PlaybackTrack from './PlaybackTrack';
import MoreOptions from './MoreOptions';

export default function PlaybackConsole({ className }) {
  return (
    <div className={className}>
      <MusicInfo />

      <div className='w-[40%] flex flex-col items-center gap-2'>
        <PlaybackButtons />
        <PlaybackTrack />
      </div>

      <MoreOptions />
    </div>
  );
}
