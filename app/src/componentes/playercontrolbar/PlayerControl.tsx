import React, { useState } from 'react';

import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Slider from '@mui/material/Slider';

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
  const [isShuffled, setIsShuffled] = useState<boolean>(false)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off')
  const [songDuration, setSongDuration] = useState(300) // segundos
  const [songProgress, setSongProgress] = useState(210) // segundos

  function formatDuration(value: number) {
    const minute = Math.floor(value / 60);
    const secondLeft = value - minute * 60;
    return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
  }

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
          gap: '12px',
        }}
      >
        <Typography 
          variant='body1'
          sx={{
            fontSize: '0.7rem',
            minWidth: '40px',
            textAlign: 'right',
            fontWeight: 400,
            color: '#777',
          }}
        >
          {formatDuration(songProgress)}
        </Typography>

        <Slider 
          value={songProgress}
          color='primary'
          size='small'
          min={0}
          step={1}
          max={songDuration}
          onChange={(_, value) => setSongProgress(value as number)}
          sx={{
            color: '#fff',
            height: 4,
            width: '100%',
            pt: 1,
            pb: 1,
            '& .MuiSlider-rail': {
              opacity: 0.28,
            },
            '& .MuiSlider-thumb': {
              width: 0,
              height: 0,
              '&:hover, &.Mui-focusVisible': {
                boxShadow: 0,
              },
            },
            '&:hover .MuiSlider-track': {
              color: 'secondary.main',
            },
            '&:hover .MuiSlider-thumb': {
              width: 12,
              height: 12
            },
          }}
        />

        <Typography 
          variant='body1'
          sx={{
            fontSize: '0.7rem',
            minWidth: '40px',
            textAlign: 'left',
            fontWeight: 400,
            color: '#777',
          }}
        >
          {formatDuration(songDuration)}
        </Typography>
      </Box>
    </Box>
  )
}