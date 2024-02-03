import Box from '@mui/material/Box';

import MediaCard from './MediaCard';

import sizeConfigs from '../../configs/sizeConfigs';
import colorConfigs from '../../configs/colorConfigs';
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
          height: `${sizeConfigs.scrollbarSize}`,
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: `${colorConfigs.scrollbar.thumb}`,
          borderRadius: `${sizeConfigs.scrollbarRadius}`,
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: `${colorConfigs.scrollbar.track}`,
          borderRadius: `${sizeConfigs.scrollbarRadius}`,
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
