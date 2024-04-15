import Box from '@mui/material/Box';

import MusicInfo from './MusicInfo/MusicInfo';
import PlaybackButtons from './PlaybackButtons';
import PlaybackTrack from './PlaybackTrack';
import MoreOptions from './MoreOptions';

export default function PlaybackConsole({ className }) {
  return (
    <Box
      className={className}
    >
      <MusicInfo />

      <Box
        sx={{
          width: '40%',
          maxWidth: '722px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <PlaybackButtons />
        <PlaybackTrack />
      </Box>

      <MoreOptions />
    </Box>
  );
}
