import React, { useState } from 'react'

import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'

import OpenInFullSharpIcon from '@mui/icons-material/OpenInFullSharp';
import CloseFullscreenSharpIcon from '@mui/icons-material/CloseFullscreenSharp';
import QueueMusicRoundedIcon from '@mui/icons-material/QueueMusicRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import VolumeControl from './VolumeControl';

export default function MoreOptions() {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)

  const buttons = [
    {
      icon: isFullscreen ? <CloseFullscreenSharpIcon /> : <OpenInFullSharpIcon />,
      action: () => handleToggleFullscreen()
    },
    {
      icon: <QueueMusicRoundedIcon />,
      action: () => console.log('Open queue')
    },
    {
      icon: <InfoOutlinedIcon />,
      action: () => console.log('Show extended music info')
    },
  ]

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  return (
    <Box sx={{
      height: '100%',
      width: '30%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      flexDirection: 'row',
      borderRadius: '8px',
      padding: '0 8px',
      overflow: 'hidden',
      gap: '8px'
    }}>
      {buttons.map((button, index) => (
        <IconButton 
        key={index}
        disableRipple
        onClick={button.action}
        sx={{
          color: '#aaa',
          p: 0,
            '& svg': {
              fontSize: '24px'
            },
            '&:hover': {
              color: '#fff'
            }
          }}
          >
          {button.icon}
        </IconButton>
      ))}
      <VolumeControl />
    </Box>
  )
}