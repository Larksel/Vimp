import Box from '@mui/material/Box';

import MediaCard from './MediaCard';

import { Track } from '../../../shared/types/vimp';

type CardListProps = {
  data: Track[];
}

//TODO Grid
export default function CardList({ data }: CardListProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: '24px',
        paddingY: '12px',
        height: '100%',
        width: '100%',
        overflowY: 'hidden',
        overflowX: 'auto',
        '&::-webkit-scrollbar': {
          height: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#5A5A5A',
          borderRadius: '8px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: '#0000',
          borderRadius: '8px',
        },
      }}
    >
      {data.map((item, index) => (
        <MediaCard
          key={index}
          item={item}
        />
      ))}
    </Box>
  );
}
