import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentTrack } from '../../features/playerSlice';

import Box from '@mui/material/Box';

import placeholder from '../../assets/images/placeholder.png';
import sizeConfigs from '../../configs/sizeConfigs';

interface ExpandedViewProps {
  visible: boolean;
}

export default function ExpandedView({ visible }: ExpandedViewProps) {
  const [cover, setCover] = useState('');
  const track = useSelector(selectCurrentTrack);

  useEffect(() => {
    setCover(track.cover);
  }, [track.cover]);

  return (
    <Box
      sx={{
        opacity: visible ? 1 : 0,
        position: 'absolute',
        top: visible ? 0 : '100%',
        right: 0,
        left: 0,
        bottom: sizeConfigs.playbackConsole.height,
        backgroundImage: `url(${cover || placeholder})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        transition: 'opacity .15s ease',
      }}
    >
      <Box
        sx={{
          height: '100%',
          width: '100%',
          bgcolor: '#222c',
          backdropFilter: 'blur(10px)',
        }}
      />
      <Box
        component='img'
        src={cover || placeholder}
        sx={{
          position: 'absolute',
          bottom: visible ? '16px' : 0,
          left: '16px',
          height: '100%',
          width: '100%',
          maxHeight: '256px',
          maxWidth: '256px',
          borderRadius: '8px',
          boxShadow: '0 5px 15px #0007',
          objectFit: 'cover',
          transition: 'all .15s ease',
        }}
      />
    </Box>
  );
}
