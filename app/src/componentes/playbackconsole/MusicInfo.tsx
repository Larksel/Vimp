import React from 'react'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import placeholderImage from '../../assets/images/placeholder.png'

interface MusicInfoProps {
  titulo: string;
  artista: string;
  // img?: any;
}

export default function MusicInfo({ titulo, artista }: MusicInfoProps) {
  return (
    <Box sx={{
      height: '100%',
      width: '30%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      flexDirection: 'row',
      borderRadius: '8px',
      padding: '0 8px',
      gap: '8px',
    }}>
      <Box>
        <Box
          component="img"
          src={placeholderImage}
          sx={{
            height: '60px',
            width: '60px',
            overflow: 'hidden',
            bgcolor: '#EB1E79',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '4px',
            objectFit: 'cover',
          }}
        />
      </Box>

      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        whiteSpace: 'nowrap'
      }}>
        <Typography variant='body1'>
          {titulo}
        </Typography>
        <Typography variant='caption'>
          {artista}
        </Typography>
      </Box>
    </Box>
  )
}