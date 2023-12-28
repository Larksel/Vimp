import React, { useState } from 'react';

import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'

import ShuffleIcon from '@mui/icons-material/Shuffle';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import RepeatIcon from '@mui/icons-material/Repeat';
import RepeatOneIcon from '@mui/icons-material/RepeatOne';

import colorConfigs from '../../configs/colorConfigs';
const colors = colorConfigs.playbackConsole.playbackControl

type RepeatMode = 'off' | 'all' | 'one'

export default function PlaybackButtons() {
  const [isShuffled, setIsShuffled] = useState<boolean>(false)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off')

  const toggleShuffle = () => {
    setIsShuffled(!isShuffled)
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const changeRepeatMode = () => {
    switch (repeatMode) {
      case 'off': {
        setRepeatMode('all')
        break;
      }
      case 'all': {
        setRepeatMode('one')
        break;
      }
      case 'one': {
        setRepeatMode('off')
        break;
      }
      default:
        break;
    }
  }

  const repeatIcons = {
    off: <RepeatIcon />,
    all: <RepeatIcon sx={{ color: 'secondary.main' }}/>,
    one: <RepeatOneIcon sx={{ color: 'secondary.main' }}/>
  }

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
          justifyContent: 'flex-end'
        }}
      >
        <IconButton disableRipple onClick={toggleShuffle}
          sx={{
            color: `${colors.unfocused}`,
            '&:hover': {
              color: '#fff'
            }
          }}
        >
          <ShuffleIcon sx={isShuffled ? { color: 'secondary.main' } : {}} />
        </IconButton>

        <IconButton disableRipple
          sx={{
            color: `${colors.unfocused}`,
            '&:hover': {
              color: '#fff'
            }
          }}
        >
          <SkipPreviousIcon />
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
        {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
      </IconButton>

      <Box
        sx={{
          display: 'flex',
          flex: 1,
        }}
      >
        <IconButton disableRipple
          sx={{
            color: `${colors.unfocused}`,
            '&:hover': {
              color: '#fff'
            }
          }}
        >
          <SkipNextIcon />
        </IconButton>

        <IconButton disableRipple onClick={changeRepeatMode}
          sx={{
            color: `${colors.unfocused}`,
            '&:hover': {
              color: '#fff'
            }
          }}
        >
          {repeatIcons[repeatMode]}
        </IconButton>
      </Box>
    </Box>
  )
}