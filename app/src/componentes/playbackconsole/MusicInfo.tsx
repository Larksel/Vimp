import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import ExpandedView from './ExpandedView';
import placeholderImage from '../../assets/images/placeholder.png';
import { selectCurrentTrack } from '../../features/playerSlice';

export default function MusicInfo() {
  const [visible, setVisible] = useState(false);
  const [cover, setCover] = useState();
  const track = useSelector(selectCurrentTrack);

  useEffect(() => {
    async function getCover() {
      const coverData = await window.VimpAPI.app.getCover(track.path);
      setCover(coverData);
    }

    getCover();
  }, [track.path]);

  const toggleVisible = () => {
    setVisible(!visible);
  };

  return (
    <>
      <ExpandedView visible={visible} />
      <Box
        onClick={toggleVisible}
        sx={{
          width: '30%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          flexDirection: 'row',
          borderRadius: '8px',
          padding: '8px',
          gap: '8px',
          userSelect: 'none',
          transition: 'all .15s ease',
          '&:hover': {
            bgcolor: '#292929',
          },
        }}
      >
        <Box
          sx={{
            height: '60px',
            width: visible ? '0' : '60px',
            transition: 'all .15s ease',
            opacity: visible ? 0 : 1,
          }}
        >
          <Box
            component='img'
            src={cover || placeholderImage}
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
              userSelect: 'none',
            }}
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
        >
          <Typography variant='body1'>{track.title}</Typography>
          <Typography variant='caption' color='text.secondary'>
            {track.artist}
          </Typography>
        </Box>
      </Box>
    </>
  );
}
