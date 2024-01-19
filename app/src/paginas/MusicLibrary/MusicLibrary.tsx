import { useState } from 'react';
import { Track } from '../../types/vimp';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import TrackList from '../../componentes/TrackList/TrackList';

//TODO estado da lista de música reseta ao mudar de página
//TODO lista virtual

export default function MusicLibrary() {
  const [tracks, setTracks] = useState<Track[]>();

  const getTracks = async () => {
    const result = await window.VimpAPI.pickFile();

    console.log(result);
    setTracks(result);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        p: '16px 4px 16px 16px',
        alignItems: 'center'
      }}
    >
      <Button
        onClick={getTracks}
        color='info'
        variant='contained'
        sx={{
          maxWidth: '120px',
        }}
      >
        Selecionar
      </Button>
      {tracks ? <TrackList data={tracks} /> : ''}
    </Box>
  );
}
