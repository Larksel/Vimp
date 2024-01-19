import { Track } from '../../types/vimp';
import Box from '@mui/material/Box';

import TrackItem from './TrackItem';

//TODO table
//TODO lista virtual
//TODO estado da lista de música reseta ao mudar de página
interface TrackListProps {
  data: Track[]
}

export default function TrackList({ data }: TrackListProps) {
  return (
    <Box sx={{
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {data.map((track, index) => (
        <TrackItem key={index} track={track}/>
      ))}
    </Box>
  )
}