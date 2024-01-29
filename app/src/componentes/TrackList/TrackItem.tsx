import { Track } from '../../../shared/types/vimp';
import { formatDuration } from '../../lib/utils';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button'

import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';

import player from '../../lib/player';

//? TrackRow ?
//? TrackBlock ?

//TODO table
interface TrackProps {
  track: Track;
}

export default function TrackItem({ track }: TrackProps) {
  const playTrack = () => {
    player.setTrack(track)
    player.play()
  }

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: '12px'
      }}
    >
      <Button
        variant='contained'
        onClick={playTrack}
        sx={{
          minWidth: '32px',
          minHeight: '32px',
          p: 0,
          whiteSpace: 'nowrap',
          textTransform: 'none',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <PlayArrowRoundedIcon />
      </Button>
      <Typography
        variant='caption'
        sx={{ 
          width: '100%', 
          whiteSpace: 'nowrap',
        }}
      >
        {track.title}
      </Typography>
      <Typography
        variant='caption'
        sx={{
          whiteSpace: 'nowrap',
        }}
      >
        {track.artist}
      </Typography>
      <Typography
        variant='caption'
        sx={{ 
          whiteSpace: 'nowrap',
        }}
      >
        {formatDuration(track.duration)}
      </Typography>
    </Box>
  );
}
