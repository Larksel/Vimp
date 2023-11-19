import React from 'react'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

import sizeConfigs from '../../configs/sizeConfigs'

import WindowButtons from './WindowButtons'

const sizes = sizeConfigs.appBar

// Definição de cada parte da aplicação
export default function AppBar() {
  return (
    <Box sx={{
      backgroundColor: '#f0f',
      height: `${sizes.height}`,
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      WebkitUserSelection: 'none',
      WebkitAppRegion: 'drag'
    }}>
      {/** Botão do menu lateral */}
      Menu Button
      
      <Typography component='h1'>
        Vimp
      </Typography>

      <Box sx={{
        WebkitAppRegion: 'no-drag',
      }}>
        <WindowButtons />
      </Box>
    </Box>
  )
}