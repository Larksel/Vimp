import Box from '@mui/material/Box';

import TrackList from '../../componentes/TrackList/TrackList';

export default function MusicLibrary() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        p: '16px 4px 16px 16px',
      }}
    >
      Music Library
      <TrackList />
    </Box>
  )
}