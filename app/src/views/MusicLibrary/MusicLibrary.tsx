import { useEffect, useState } from 'react';
import { Track } from '../../../shared/types/vimp';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';

import TrackList from '../../componentes/TrackList/TrackList';
import player from '../../lib/player';
import queue from '../../lib/queue'

//TODO estado da lista de música reseta ao mudar de página
//TODO lista virtual

export default function MusicLibrary() {
  const [tracks, setTracks] = useState<Track[]>();

  useEffect(() => {
    async function getTracks() {
      const res: Track[] = await window.VimpAPI.db.getTracks();

      setTracks(res)
    }

    getTracks()
  }, [])

  const getTracks = async () => {
    const result = await window.VimpAPI.app.pickFile();

    console.log(result);
    setTracks(result);
  };

  const playTracks = () => {
    console.log('add to playlist')

    tracks?.map((track) => {
      if (!queue.getQueue().some(existingTrack => existingTrack.path === track.path)) {
        queue.add(track);
      }
    })

    queue.play()
    //player.setTrack('')
    //player.play()
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: '8px',
      }}>
        <Button
          variant='contained'
          onClick={playTracks}
          sx={{
            minWidth: '48px',
            minHeight: '48px',
            p: 0,
            whiteSpace: 'nowrap',
            textTransform: 'none',
            display: 'flex',
            alignItems: 'center',
            borderRadius: '50%',
            bgcolor: 'secondary.main',
            '& svg': {
              color: 'black',
              fontSize: '2rem',
            }
          }}
        >
          <PlayArrowRoundedIcon />
        </Button>
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
      </Box>
      {tracks ? <TrackList data={tracks} /> : ''}
    </Box>
  );
}
