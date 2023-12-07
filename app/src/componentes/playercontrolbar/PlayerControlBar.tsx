import React from 'react'

import Box from '@mui/material/Box'

import sizeConfigs from '../../configs/sizeConfigs';
const sizes = sizeConfigs.playerControl

export default function PlayerControlBar() {
  return (
    <Box sx={{ 
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      bgcolor: '#000',
      paddingX: '8px',
      height: `${sizes.height}`,
    }}>
      <p>CurrentTrack</p>
      <p>PlayerControl</p>
      <p>OtherButtons</p>
    </Box>
  )
}