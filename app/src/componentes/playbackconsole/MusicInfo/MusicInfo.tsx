import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import ExpandedView from '../ExpandedView';
import placeholderImage from '../../../assets/images/placeholder.png';
import { selectCurrentTrack } from '../../../features/playerSlice';
import InfoText from './InfoText';

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
            width: '100%',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            paddingX: '8px',
            maskImage:
              'linear-gradient(90deg,transparent 0,#000 8px,#000 calc(100% - 12px),transparent)',
          }}
        >
          <InfoText variant='body1' text={track.title} />
          <InfoText
            variant='caption'
            color='text.secondary'
            text={track.artist}
          />
        </Box>
      </Box>
    </>
  );
}
