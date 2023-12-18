import React, { useState } from 'react';

import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import LinearProgress from '@mui/material/LinearProgress';

import ShuffleIcon from '@mui/icons-material/Shuffle';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import RepeatIcon from '@mui/icons-material/Repeat';
import RepeatOneIcon from '@mui/icons-material/RepeatOne';
import Typography from '@mui/material/Typography'

import sizeConfigs from '../../configs/sizeConfigs';

const sizes = sizeConfigs.playerControlBar.playerControl

type RepeatMode = 'off' | 'all' | 'one'

export default function PlayerControl() {
  const [isShuffled, setIsShuffled] = useState<boolean>()
  const [isPlaying, setIsPlaying] = useState<boolean>()
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off')
  const [songDuration, setSongDuration] = useState('5:00')
  const [songProgress, setSongProgress] = useState('3:75')

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
    <Box sx={{
      width: `${sizes.width}`,
      maxWidth: `${sizes.maxWidth}`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <Box /* Buttons */
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
            <ShuffleIcon sx={isShuffled ? { color: 'secondary.main'} : {}}/>
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
      <Box /* Bar */
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px'
        }}
      >
        <Typography 
          variant='body1'
          sx={{
            fontSize: '0.7rem',
            minWidth: '40px',
            textAlign: 'right',
            fontWeight: 400,
            color: '#777'
          }}
        >
          {songProgress}
        </Typography>

        <LinearProgress 
          variant='determinate' 
          value={-1}
          color='inherit'
          sx={{
            width: '100%',
            borderRadius: '8px',
            '& > .MuiLinearProgress-bar': {
              borderRadius: '8px',
            }
          }}
        />

        <Typography 
          variant='body1'
          sx={{
            fontSize: '0.7rem',
            minWidth: '40px',
            textAlign: 'left',
            fontWeight: 400,
            color: '#777'
          }}
        >
          {songDuration}
        </Typography>
      </Box>
    </Box>
  )
}