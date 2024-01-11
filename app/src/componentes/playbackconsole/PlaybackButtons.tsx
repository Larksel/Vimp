import { useSelector, useDispatch } from 'react-redux';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

import ShuffleRoundedIcon from '@mui/icons-material/ShuffleRounded';
import SkipPreviousRoundedIcon from '@mui/icons-material/SkipPreviousRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import SkipNextRoundedIcon from '@mui/icons-material/SkipNextRounded';
import RepeatRoundedIcon from '@mui/icons-material/RepeatRounded';
import RepeatOneRoundedIcon from '@mui/icons-material/RepeatOneRounded';

import {
  setShuffle, // Mover para Queue
  changeRepeat, // Mover para Queue
  selectShuffle,
  selectIsPlaying,
  selectRepeat,
} from '../../features/playerSlice';

import player from '../../lib/player';
import colorConfigs from '../../configs/colorConfigs';
const colors = colorConfigs.playbackConsole.playbackControl;

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

  const handleNext = () => {
    console.log('Next song')
    /*
    if (!(currentTrack == tracks.length - 1)) {
      nextTrack = currentTrack + 1;
    } else {
      nextTrack = 0;
    }

    currentTrack = nextTrack;

    player.setTrack(tracks[nextTrack]);
    player.play();
    */
  };

  const handlePrevious = () => {
    console.log('Previous song')
    /*
    if (!(currentTrack == 0)) {
      prevTrack = currentTrack - 1;
    } else {
      prevTrack = tracks.length - 1;
    }

    currentTrack = prevTrack;

    player.setTrack(tracks[prevTrack]);
    player.play();
    */
  };

  const repeatIcons = {
    off: <RepeatRoundedIcon />,
    all: <RepeatRoundedIcon sx={{ color: 'secondary.main' }} />,
    one: <RepeatOneRoundedIcon sx={{ color: 'secondary.main' }} />,
  };

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        gap: '16px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          justifyContent: 'flex-end',
        }}
      >
        <IconButton
          disableRipple
          onClick={() => dispatch(setShuffle(!shuffle))}
          sx={{
            color: `${colors.unfocused}`,
            '&:hover': {
              color: '#fff',
            },
          }}
        >
          <ShuffleRoundedIcon sx={shuffle ? { color: 'secondary.main' } : {}} />
        </IconButton>

        <IconButton
          disableRipple
          onClick={handlePrevious}
          sx={{
            color: `${colors.unfocused}`,
            '&:hover': {
              color: '#fff',
            },
          }}
        >
          <SkipPreviousRoundedIcon />
        </IconButton>
      </Box>

      <IconButton
        disableRipple
        onClick={handlePlayPause}
        sx={{
          height: '35px',
          width: '35px',
          bgcolor: '#fff',
          color: '#000',
        }}
      >
        {isPlaying ? <PauseRoundedIcon /> : <PlayArrowRoundedIcon />}
      </IconButton>

      <Box
        sx={{
          display: 'flex',
          flex: 1,
        }}
      >
        <IconButton
          disableRipple
          onClick={handleNext}
          sx={{
            color: `${colors.unfocused}`,
            '&:hover': {
              color: '#fff',
            },
          }}
        >
          <SkipNextRoundedIcon />
        </IconButton>

        <IconButton
          disableRipple
          onClick={() => dispatch(changeRepeat())}
          sx={{
            color: `${colors.unfocused}`,
            '&:hover': {
              color: '#fff',
            },
          }}
        >
          {repeatIcons[repeat]}
        </IconButton>
      </Box>
    </Box>
  );
}
