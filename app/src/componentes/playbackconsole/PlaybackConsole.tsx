import React from 'react'

import Box from '@mui/material/Box'

import MusicInfo from './MusicInfo';
import PlaybackButtons from './PlaybackButtons';
import PlaybackTrack from './PlaybackTrack';

import sizeConfigs from '../../configs/sizeConfigs';
import colorConfigs from '../../configs/colorConfigs';

const sizes = sizeConfigs.playbackConsole
const colors = colorConfigs.playbackConsole

export default function PlaybackConsole() {
  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      bgcolor: `${colors.bg}`,
      paddingX: '8px',
      height: `${sizes.height}`,
      width: `${sizes.width}`,
      minWidth: `${sizes.minWidth}`,
      zIndex: 6
    }}>
      <MusicInfo
        titulo='Hello World'
        artista='Dinosaurs'
      />

      <Box sx={{
        width: `${sizes.playbackControl.width}`,
        maxWidth: `${sizes.playbackControl.maxWidth}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <PlaybackButtons />
        <PlaybackTrack />
      </Box>

      <Box sx={{
        height: '100%',
        width: '30%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        flexDirection: 'row',
        borderRadius: '8px',
        padding: '0 8px',
        gap: '8px'
      }}>
        <p>MoreOptions</p>
      </Box>
    </Box>
  )
}