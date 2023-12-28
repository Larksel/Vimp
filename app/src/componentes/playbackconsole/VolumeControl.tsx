import React, { useState } from 'react'

import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Slider from '@mui/material/Slider';

import VolumeOffRoundedIcon from '@mui/icons-material/VolumeOffRounded';
import VolumeMuteRoundedIcon from '@mui/icons-material/VolumeMuteRounded';
import VolumeDownRoundedIcon from '@mui/icons-material/VolumeDownRounded';
import VolumeUpRoundedIcon from '@mui/icons-material/VolumeUpRounded';

const volumeIconStyle = {
  color: '#aaa',
  '&:hover': {
    color: '#fff'
  }
}

export default function VolumeControl() {
  const [volume, setVolume] = useState<number>(55);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const handleMute = () => {
    if (!isMuted) {
      setIsMuted(true)
    } else {
      setIsMuted(false)
    }
  }

  const handleVolumeChange = (value: number) => {
    if (isMuted) {
      setIsMuted(!isMuted)
    }
    setVolume(value)
  }

  const volumeIcons = () => {
    if (volume === 0 || isMuted) {
      return <VolumeOffRoundedIcon sx={volumeIconStyle}/>

    } else if (volume >= 1 && volume <= 33) {
      return <VolumeMuteRoundedIcon sx={volumeIconStyle}/>

    } else if (volume >= 34 && volume <= 66) {
      return <VolumeDownRoundedIcon sx={volumeIconStyle}/>
    } else {
      return <VolumeUpRoundedIcon sx={volumeIconStyle}/>
    }
  }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    }}>
      <IconButton 
        disableRipple 
        onClick={handleMute}
        sx={{
          p: 0,
          '& svg': {
            fontSize: '24px'
          },
        }}
      >
        {volumeIcons()}
      </IconButton>

      <Slider 
        value={volume} 
        onChange={(_, value) => handleVolumeChange(value as number)}
        size='small'
        valueLabelDisplay="auto"
        min={0}
        max={100}
        step={1}
        sx={{
          color: '#fff',
          height: 4,
          width: '100%',
          pt: 1,
          pb: 1,
          minWidth: '90px',
          maxWidth: '100px',
          '& .MuiSlider-rail': {
            opacity: 0.28,
          },
          '& .MuiSlider-thumb': {
            width: 0,
            height: 0,
            '&:hover, &.Mui-focusVisible, &.Mui-active': {
              boxShadow: 0,
            },
          },
          '&:hover .MuiSlider-track': {
            color: 'secondary.main',
          },
          '&:hover .MuiSlider-thumb, & .MuiSlider-thumb.Mui-active': {
            width: 16,
            height: 16
          },
          '& .MuiSlider-valueLabel': {
            lineHeight: 1.2,
            fontSize: 12,
            background: 'unset',
            padding: 0,
            width: 20,
            height: 20,
            borderRadius: '50% 50% 50% 0',
            backgroundColor: 'secondary.dark',
            transformOrigin: 'bottom left',
            transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
            '&::before': { display: 'none' },
            '&.MuiSlider-valueLabelOpen': {
              transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
            },
            '& > *': {
              transform: 'rotate(45deg)',
            },
          },
        }}
      />
    </Box>
  )
}