import React, { useState } from 'react';

import Box from '@mui/material/Box'
import Slider from '@mui/material/Slider';

import Typography from '@mui/material/Typography'

export default function PlaybackTrack() {
  const [songDuration, setSongDuration] = useState(300) // segundos
  const [songProgress, setSongProgress] = useState(210) // segundos

  function formatDuration(value: number) {
    const minute = Math.floor(value / 60);
    const secondLeft = value - minute * 60;
    return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
  }

  return (
    <Box
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
            '&:hover, &.Mui-focusVisible, &.Mui-active': {
              boxShadow: 0,
            },
          },
          '&:hover .MuiSlider-track': {
            color: 'secondary.main',
          },
          '&:hover .MuiSlider-thumb, & .MuiSlider-thumb.Mui-active': {
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
  )
}