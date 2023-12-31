import React from 'react';

import Box from '@mui/material/Box';

import MediaCard from './MediaCard';

import sizeConfigs from '../../configs/sizeConfigs';
import colorConfigs from '../../configs/colorConfigs';

interface CardListProps {
  data: {
    title: string;
    desc: string;
  }[]
}

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
      {data.map(({ title, desc }, index) => (
        <MediaCard
          key={index}
          title={title}
          desc={desc}
          action={() => console.log(title)}
        />
      ))}
    </Box>
  );
}
