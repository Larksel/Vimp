import React, { useState } from 'react';

import Box from '@mui/material/Box';
import List from '@mui/material/List';

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import LibraryMusicRoundedIcon from '@mui/icons-material/LibraryMusicRounded';
import VideoLibraryRoundedIcon from '@mui/icons-material/VideoLibraryRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';

import sizeConfigs from '../../configs/sizeConfigs';
import colorConfigs from '../../configs/colorConfigs';

import SidebarItem from './SidebarItem';
import PlaylistItem from './PlaylistItem';

/*
const playlists = () => {
 *  // Get all playlists available
}
*/
const playlists = [
  {
    id: 1,
    nome: 'Hello World',
    imgPath: '#',
    //link: '/playlist/teste1' - link to the playlist
  },
  {
    id: 2,
    nome: 'Teste 2',
    imgPath: '#',
    //link: '/playlist/teste2' - link to the playlist
  },
  {
    id: 3,
    nome: 'Teste 3',
    imgPath: '#',
    //link: '/playlist/teste3' - link to the playlist
  },
  {
    id: 4,
    nome: 'Teste 4',
    imgPath: '#',
    //link: '/playlist/teste4' - link to the playlist
  },
  {
    id: 5,
    nome: 'Teste 5',
    imgPath: '#',
    //link: '/playlist/teste5' - link to the playlist
  },
  {
    id: 6,
    nome: 'Teste 6',
    imgPath: '#',
    //link: '/playlist/teste6' - link to the playlist
  },
  {
    id: 7,
    nome: 'Teste 7',
    imgPath: '#',
    //link: '/playlist/teste7' - link to the playlist
  },
  {
    id: 8,
    nome: 'Teste 8',
    imgPath: '#',
    //link: '/playlist/teste8' - link to the playlist
  },
  {
    id: 9,
    nome: 'Teste 9',
    imgPath: '#',
    //link: '/playlist/teste9' - link to the playlist
  },
  {
    id: 10,
    nome: 'Teste 10',
    imgPath: '#',
    //link: '/playlist/teste10' - link to the playlist
  },
];

const mainList = [
  'Home',
  'Search',
  'Music Library',
  'Video Library',
  'New Playlist',
];

const mainListIcons = [
  <HomeRoundedIcon />,
  <SearchRoundedIcon />,
  <LibraryMusicRoundedIcon />,
  <VideoLibraryRoundedIcon />,
  <AddRoundedIcon />,
];

const colors = colorConfigs.sidebar;
const sizes = sizeConfigs.sidebar;

export default function Sidebar() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleItemClick = (index: number) => {
    setSelectedIndex(index);
  };

  return (
    <Box
      component='nav'
      sx={{
        pr: '8px',
        minWidth: sizes.width,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        height: '100%',
      }}
    >
      <Box
        sx={{
          width: '100%',
          bgcolor: colors.bg,
          borderRadius: '8px',
        }}
      >
        <List>
          {' '}
          {/* Main list*/}
          {mainList.map((text, index) => (
            <SidebarItem
              key={text}
              text={text}
              icon={mainListIcons[index]}
              selected={selectedIndex === index}
              onClick={() => (index !== 4 ? handleItemClick(index) : '')}
            />
          ))}
        </List>
      </Box>

      <Box
        sx={{
          mt: '8px',
          bgcolor: colors.bg,
          borderRadius: '8px',
          width: '100%',
          overflowX: 'hidden',
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            width: `${sizes.scrollbar.width}`,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: `${colorConfigs.scrollbar.thumb}`,
            borderRadius: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: `${colorConfigs.scrollbar.track}`,
            borderRadius: '8px',
          },
        }}
      >
        <List>
          {' '}
          {/* Playlist list*/}
          {playlists.map((playlist) => (
            <PlaylistItem key={playlist.id} playlist={playlist} />
          ))}
        </List>
      </Box>
    </Box>
  );
}
