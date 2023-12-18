import React from 'react'

import Box from '@mui/material/Box'

import PlayerControl from './PlayerControl';

import sizeConfigs from '../../configs/sizeConfigs';
const sizes = sizeConfigs.playerControlBar

export default function PlayerControlBar() {
  return (
    <Box sx={{ 
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      bgcolor: '#000',
      paddingX: '8px',
      height: `${sizes.height}`,
      width: `${sizes.width}`,
      minWidth: `${sizes.minWidth}`,
      zIndex: 6
    }}>
      <p>CurrentTrack</p>
      <PlayerControl />
      <p>OtherButtons</p>
    </Box>
  )
}