import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';

import placeholder from '../../assets/images/placeholder.png';
import { Track } from '../../../shared/types/vimp';
import player from '../../lib/player';

interface MediaCardProps {
  item: Track;
}

export default function MediaCard({ item }: MediaCardProps) {
  const [cover, setCover] = useState();

  useEffect(() => {
    async function getCover() {
      const coverData = await window.VimpAPI.app.getCover(item.path);
      setCover(coverData);
    }

    getCover();
  }, [item.path]);

  const playTrack = () => {
    player.setTrack(item);
    player.play();
  };

  return (
    <Card
      onClick={playTrack}
      sx={{
        bgcolor: '#181818',
        boxShadow: 0,
        minWidth: '201px',
        minHeight: '284px',
        borderRadius: '8px',
        p: '16px',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        backgroundImage: 'none',
        overflow: 'hidden',
        transition: 'background-color .3s ease',
        '&:hover': {
          bgcolor: '#292929',
          cursor: 'pointer',
        },
        '&:hover .MuiButtonBase-root': {
          opacity: 1,
          transform: 'translateY(0)',
        },
      }}
    >
      <Box>
        <Box sx={{ position: 'relative' }}>
          <IconButton
            disableRipple
            sx={{
              position: 'absolute',
              opacity: 0,
              bgcolor: 'secondary.dark',
              transition: 'all .3s ease',
              pointerEvents: 'none',
              bottom: '8px',
              right: '8px',
              transform: 'translateY(8px)',
              boxShadow: '0 8px 8px rgba(0,0,0,0.3)',
            }}
          >
            <PlayArrowRoundedIcon />
          </IconButton>
          <CardMedia
            component='img'
            image={cover || placeholder}
            sx={{
              height: '170px',
              width: '170px',
              borderRadius: '8px',
              mb: '16px',
              userSelect: 'none',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              objectFit: 'cover',
            }}
          />
        </Box>
        <CardContent
          sx={{
            p: '0px',
            '&:last-child': {
              pb: '0px',
            },
          }}
        >
          <Typography
            variant='body2'
            sx={{
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              maxWidth: '170px',
            }}
          >
            {item.title}
          </Typography>
          <Typography
            variant='caption'
            color='text.secondary'
            sx={{
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              maxWidth: '170px',
            }}
          >
            {item.artist}
          </Typography>
        </CardContent>
      </Box>
    </Card>
  );
}
