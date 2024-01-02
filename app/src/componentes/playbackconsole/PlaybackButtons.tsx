import { useState } from 'react';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

import ShuffleRoundedIcon from '@mui/icons-material/ShuffleRounded';
import SkipPreviousRoundedIcon from '@mui/icons-material/SkipPreviousRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import SkipNextRoundedIcon from '@mui/icons-material/SkipNextRounded';
import RepeatRoundedIcon from '@mui/icons-material/RepeatRounded';
import RepeatOneRoundedIcon from '@mui/icons-material/RepeatOneRounded';

import colorConfigs from '../../configs/colorConfigs';
const colors = colorConfigs.playbackConsole.playbackControl;

type RepeatMode = 'off' | 'all' | 'one';

export default function PlaybackButtons() {
  const [isShuffled, setIsShuffled] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');

  const toggleShuffle = () => {
    setIsShuffled(!isShuffled);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const changeRepeatMode = () => {
    switch (repeatMode) {
      case 'off': {
        setRepeatMode('all');
        break;
      }
      case 'all': {
        setRepeatMode('one');
        break;
      }
      case 'one': {
        setRepeatMode('off');
        break;
      }
      default:
        break;
    }
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
          onClick={toggleShuffle}
          sx={{
            color: `${colors.unfocused}`,
            '&:hover': {
              color: '#fff',
            },
          }}
        >
          <ShuffleRoundedIcon
            sx={isShuffled ? { color: 'secondary.main' } : {}}
          />
        </IconButton>

        <IconButton
          disableRipple
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
          onClick={changeRepeatMode}
          sx={{
            color: `${colors.unfocused}`,
            '&:hover': {
              color: '#fff',
            },
          }}
        >
          {repeatIcons[repeatMode]}
        </IconButton>
      </Box>
    </Box>
  );
}
