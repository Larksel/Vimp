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
        mb: '8px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          gap: '8px',
          justifyContent: 'flex-end'
        }}
      >
        <IconButton onClick={toggleShuffle}>
          <ShuffleIcon sx={isShuffled ? { color: 'secondary.main' } : {}} />
        </IconButton>

        <IconButton>
          <SkipPreviousIcon />
        </IconButton>
      </Box>

      <IconButton
        disableRipple
        onClick={handlePlayPause}
        sx={{
          height: '32px',
          width: '32px',
          bgcolor: '#fff',
          '& > svg': {
            color: '#000'
          }
        }}
      >
        {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
      </IconButton>

      <Box
        sx={{
          display: 'flex',
          flex: 1,
          gap: '8px'
        }}
      >
        <IconButton>
          <SkipNextIcon />
        </IconButton>

        <IconButton
          onClick={changeRepeatMode}
        >
          {repeatIcons[repeatMode]}
        </IconButton>
      </Box>
    </Box>
  )
}