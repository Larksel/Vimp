import React from 'react'

import Box from '@mui/material/Box';
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import PlayArrowSharpIcon from '@mui/icons-material/PlayArrowSharp';

import placeholder from '../../assets/images/placeholder.png'

interface CardProps {
  title: string;
  subtitle: string;
  action: () => void
}

export default function GenericCard({ title, subtitle, action }: CardProps) {
  return (
    <Card onClick={action}
      sx={{ 
        bgcolor: '#181818',
        boxShadow: 0,
        width: '201px',
        height: '284px',
        borderRadius: '8px',
        p: '16px',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        backgroundImage: 'none',
        transition: 'background-color .3s ease',
        '&:hover': {
          bgcolor: 'rgba(255,255,255,0.10)',
          cursor: 'pointer'
        },
        '&:hover .MuiButtonBase-root': {
          opacity: 1,
          transform: 'translateY(0)',
        }
      }}
    >
      <Box>
        <Box sx={{position: 'relative'}}>
          <IconButton disableRipple sx={{
            position: 'absolute',
            opacity: 0,
            bgcolor: '#772277', //! WYSI
            transition: 'all .3s ease',
            pointerEvents: 'none',
            bottom: '8px',
            right: '8px',
            transform: 'translateY(8px)'
          }}>
            <PlayArrowSharpIcon />
          </IconButton>
          <CardMedia 
            component='img'
            image={placeholder}
            sx={{
              height: '170px',
              width: '170px',
              borderRadius: '8px',
              mb: '16px',
              userSelect: 'none'
            }}
          />
        </Box>
        <CardContent sx={{
          p: '0px',
          '&:last-child': {
            pb: '0px'
          }
        }}>
          <Typography variant="body1" component="div">
            {title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        </CardContent>
      </Box>
    </Card>
  )
}